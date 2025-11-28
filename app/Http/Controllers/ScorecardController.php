<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Scoresheet;
use App\Models\ScoresheetVersion;

class ScorecardController extends Controller
{
    // 🟣 View the latest version of the scoresheet
    public function index()
    {
        $latestVersion = ScoresheetVersion::orderByDesc('dateAdministered')->value('versionID');

        if (!$latestVersion) {
            return Inertia::render('admin/scorecard', ['scoresheet' => []]);
        }

        // load Scoresheet models via the version relation
        $rows = ScoresheetVersion::with('sheet')
            ->where('versionID', $latestVersion)
            ->get()
            ->map(fn ($sv) => $sv->sheet)
            ->filter();

        // deterministic ordering by item then subitem
        $rows = $rows->sortBy(fn ($r) => (string) ($r->item ?? '') . '|' . (string) ($r->subitem ?? ''))->values();

        $scoresheet = [];
        foreach ($rows as $row) {
            $item = $row->item;
            if (!isset($scoresheet[$item])) {
                $scoresheet[$item] = [
                    'parent' => $row,
                    'subitems' => [],
                ];
            }
            if (!empty($row->subitem)) {
                $scoresheet[$item]['subitems'][] = $row;
            }
        }

        return Inertia::render('admin/scorecard', [
            'scoresheet' => $scoresheet,
        ]);
    }

    // 🟢 Create a new scoresheet version (copy all items + apply new edits)
    public function saveNewVersion(Request $request)
    {
        $items = $request->input('items', []);
        if (empty($items)) {
            return back()->with('error', 'No items to save.');
        }

        $versionID = 'V' . strtoupper(uniqid());
        $dateNow = now();
        $adminID = auth()->id();

        foreach ($items as $item) {
            $newItemID = 'I' . strtoupper(uniqid());

            $new = Scoresheet::create([
                'itemID' => $newItemID,
                'item' => $item['item'],
                'subitem' => $item['subitem'] ?? null,
                'yesValue' => $item['yesValue'] ?? 0,
                'noValue' => $item['noValue'] ?? 0,
                'partlyValue' => $item['partlyValue'] ?? 0,
                'adminID' => $adminID,
            ]);

            ScoresheetVersion::create([
                'versionID' => $versionID,
                'itemID' => $new->itemID,
                'adminID' => $adminID,
                'dateAdministered' => $dateNow,
            ]);
        }

        return redirect()->route('admin.scorecard')->with('success', "New version $versionID created.");
    }

    // DISPLAY FOR MANAGE SCORESHEET
    public function manage()
    {
        $latestVersion = ScoresheetVersion::orderByDesc('dateAdministered')->value('versionID');

        $rows = ScoresheetVersion::with('sheet')
            ->when($latestVersion, fn ($q) => $q->where('versionID', $latestVersion))
            ->get()
            ->map(fn ($sv) => $sv->sheet)
            ->filter();

        // deterministic ordering by item then subitem
        $rows = $rows->sortBy(fn ($r) => (string) ($r->item ?? '') . '|' . (string) ($r->subitem ?? ''))->values();

        $scoresheet = [];
        foreach ($rows as $row) {
            $item = $row->item;
            if (!isset($scoresheet[$item])) {
                $scoresheet[$item] = [
                    'parent' => $row,
                    'subitems' => [],
                ];
            }
            if (!empty($row->subitem)) {
                $scoresheet[$item]['subitems'][] = $row;
            }
        }

        return Inertia::render('admin/managescoresheet', [
            'scoresheet' => $scoresheet,
        ]);
    }

    // 🟡 View a specific version (for old scored reports)
    public function showVersion($versionID)
    {
        $rows = ScoresheetVersion::with('sheet')
            ->where('versionID', $versionID)
            ->get()
            ->map(fn ($sv) => $sv->sheet)
            ->filter();

        // deterministic ordering by item then subitem
        $rows = $rows->sortBy(fn ($r) => (string) ($r->item ?? '') . '|' . (string) ($r->subitem ?? ''))->values();

        $scoresheet = [];
        foreach ($rows as $row) {
            $item = $row->item;
            if (!isset($scoresheet[$item])) {
                $scoresheet[$item] = [
                    'parent' => $row,
                    'subitems' => [],
                ];
            }
            if (!empty($row->subitem)) {
                $scoresheet[$item]['subitems'][] = $row;
            }
        }

        return Inertia::render('admin/scorecardVersionView', [
            'scoresheet' => $scoresheet,
            'versionID' => $versionID,
        ]);
    }

    // 🟠 Finalize Edits into a New Version
    public function finalizeVersion(Request $request)
    {
        $editedItems = $request->input('editedItems', []);  // edited or newly added items
        $deletedItemIDs = $request->input('deletedItemIDs', []);
        $deletedItemIDs = is_array($deletedItemIDs) ? $deletedItemIDs : [];

        $latestVersion = ScoresheetVersion::orderByDesc('dateAdministered')->value('versionID');

        if (!$latestVersion) {
            return back()->with('error', 'No existing version found.');
        }

        $currentVersions = ScoresheetVersion::where('versionID', $latestVersion)->get();

        $versionID = 'V' . strtoupper(uniqid());
        $dateNow = now();
        $adminID = auth()->id();

        // Re-insert current items unless their itemID was explicitly deleted
        foreach ($currentVersions as $sv) {
            $row = $sv->sheet;
            if (!$row) {
                continue;
            }

            if (in_array($row->itemID, $deletedItemIDs, true)) {
                continue;
            }

            $edited = collect($editedItems)->firstWhere('itemID', $row->itemID);

            $newItemID = 'I' . strtoupper(uniqid());

            $new = Scoresheet::create([
                'itemID' => $newItemID,
                'item' => $edited['item'] ?? $row->item,
                'subitem' => $edited['subitem'] ?? $row->subitem,
                'yesValue' => $edited['yesValue'] ?? $row->yesValue,
                'noValue' => $edited['noValue'] ?? $row->noValue,
                'partlyValue' => $edited['partlyValue'] ?? $row->partlyValue,
                'adminID' => $adminID,
            ]);

            ScoresheetVersion::create([
                'versionID' => $versionID,
                'itemID' => $new->itemID,
                'adminID' => $adminID,
                'dateAdministered' => $dateNow,
            ]);
        }

        // Add brand-new items (editedItems with no itemID OR with temp prefix)
        foreach ($editedItems as $item) {
            $isNew = empty($item['itemID']) || (is_string($item['itemID']) && str_starts_with($item['itemID'], 'temp_'));
            if ($isNew) {
                $newItemID = 'I' . strtoupper(uniqid());

                $new = Scoresheet::create([
                    'itemID' => $newItemID,
                    'item' => $item['item'],
                    'subitem' => $item['subitem'] ?? null,
                    'yesValue' => $item['yesValue'] ?? 0,
                    'noValue' => $item['noValue'] ?? 0,
                    'partlyValue' => $item['partlyValue'] ?? 0,
                    'adminID' => $adminID,
                ]);

                ScoresheetVersion::create([
                    'versionID' => $versionID,
                    'itemID' => $new->itemID,
                    'adminID' => $adminID,
                    'dateAdministered' => $dateNow,
                ]);
            }
        }

        return redirect()->route('admin.scorecard')
            ->with('success', "New version $versionID created successfully.");
    }
}
