export const Ziggy = {
  url: 'http://gadmanagementsys.test', // your local URL
  port: null,
  defaults: {},
  routes: {
    "sanctum.csrf-cookie": { uri: "sanctum/csrf-cookie", methods: ["GET","HEAD"] },
    "login": { uri: "login", methods: ["GET","HEAD"] },
    "login.attempt": { uri: "login", methods: ["POST"] }, // ✅ fixed
    "logout": { uri: "logout", methods: ["POST"] },
    "register": { uri: "register", methods: ["GET","HEAD"] },
    "register.store": { uri: "signup", methods: ["POST"] },
    "admin.home": { uri: "admin/home", methods: ["GET","HEAD"] },
    "enduser.home": { uri: "enduser/home", methods: ["GET","HEAD"] },
    "evaluator.home": { uri: "evaluator/home", methods: ["GET","HEAD"] },
    "profile.edit": { uri: "profile", methods: ["GET","HEAD"] },
    "profile.update": { uri: "profile", methods: ["PATCH"] },
    "profile.destroy": { uri: "profile", methods: ["DELETE"] },
    "password.request": { uri: "forgot-password", methods: ["GET","HEAD"] },
    "password.email": { uri: "forgot-password", methods: ["POST"] },
    "password.reset": { uri: "reset-password/{token}", methods: ["GET","HEAD"], parameters: ["token"] },
    "password.store": { uri: "reset-password", methods: ["POST"] },
    "verification.notice": { uri: "verify-email", methods: ["GET","HEAD"] },
    "verification.verify": { uri: "verify-email/{id}/{hash}", methods: ["GET","HEAD"], parameters: ["id","hash"] },
    "verification.send": { uri: "email/verification-notification", methods: ["POST"] },
    "password.confirm": { uri: "confirm-password", methods: ["GET","HEAD"] },
    "password.update": { uri: "password", methods: ["PUT"] },
    "storage.local": { uri: "storage/{path}", methods: ["GET","HEAD"], wheres: { path: ".*" }, parameters: ["path"] }
  }
};

// Merge with global Ziggy if it exists
if (typeof window !== 'undefined' && typeof window.Ziggy !== 'undefined') {
  Object.assign(Ziggy.routes, window.Ziggy.routes);
}

export default Ziggy;
