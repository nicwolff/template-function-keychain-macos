"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/keychain/keychain.js
var require_keychain = __commonJS({
  "node_modules/keychain/keychain.js"(exports2, module2) {
    var spawn = require("child_process").spawn;
    var noop = function() {
    };
    if (!Buffer.from) {
      Buffer.from = function(data, encoding, len) {
        return new Buffer(data, encoding, len);
      };
    }
    if (Buffer.from === Uint8Array.from) {
      throw new Error("Node >= 4.0.0 to < 4.5.0 are unsupported");
    }
    function KeychainAccess() {
      this.executablePath = "/usr/bin/security";
    }
    KeychainAccess.prototype.getPassword = function(opts, fn) {
      opts = opts || {};
      opts.type = (opts.type || "generic").toLowerCase();
      fn = fn || noop;
      var err2;
      if (process.platform !== "darwin") {
        err2 = new KeychainAccess.errors.UnsupportedPlatformError(null, process.platform);
        fn(err2, null);
        return;
      }
      if (!opts.account) {
        err2 = new KeychainAccess.errors.NoAccountProvidedError();
        fn(err2, null);
        return;
      }
      if (!opts.service) {
        err2 = new KeychainAccess.errors.NoServiceProvidedError();
        fn(err2, null);
        return;
      }
      var security = spawn(this.executablePath, ["find-" + opts.type + "-password", "-a", opts.account, "-s", opts.service, "-g"]);
      var keychain2 = "";
      var password = "";
      security.on("error", function(err3) {
        err3 = new KeychainAccess.errors.ServiceFailureError(null, err3.message);
        fn(err3, null);
        return;
      });
      security.stdout.on("data", function(d) {
        keychain2 += d.toString();
      });
      security.stderr.on("data", function(d) {
        password += d.toString();
      });
      security.on("close", function(code, signal) {
        if (code !== 0) {
          err2 = new KeychainAccess.errors.PasswordNotFoundError();
          fn(err2, null);
          return;
        }
        if (/password/.test(password)) {
          if (/^password: 0x([0-9a-fA-F]+)/.test(password)) {
            var hexPassword = password.match(/0x([0-9a-fA-F]+)/, "")[1];
            fn(null, Buffer.from(hexPassword, "hex").toString());
          } else {
            fn(null, password.match(/"(.*)\"/, "")[1]);
          }
        } else {
          err2 = new KeychainAccess.errors.PasswordNotFoundError();
          fn(err2, null);
        }
      });
    };
    KeychainAccess.prototype.setPassword = function(opts, fn) {
      opts = opts || {};
      opts.type = (opts.type || "generic").toLowerCase();
      fn = fn || noop;
      var err2;
      if (process.platform !== "darwin") {
        err2 = new KeychainAccess.errors.UnsupportedPlatformError(null, process.platform);
        fn(err2, null);
        return;
      }
      if (!opts.account) {
        err2 = new KeychainAccess.errors.NoAccountProvidedError();
        fn(err2, null);
        return;
      }
      if (!opts.service) {
        err2 = new KeychainAccess.errors.NoServiceProvidedError();
        fn(err2, null);
        return;
      }
      if (!opts.password) {
        err2 = new KeychainAccess.errors.NoPasswordProvidedError();
        fn(err2, null);
        return;
      }
      var security = spawn(this.executablePath, ["add-" + opts.type + "-password", "-a", opts.account, "-s", opts.service, "-w", opts.password]);
      var self = this;
      security.on("error", function(err3) {
        err3 = new KeychainAccess.errors.ServiceFailureError(null, err3.message);
        fn(err3, null);
        return;
      });
      security.on("close", function(code, signal) {
        if (code !== 0) {
          if (code == 45) {
            self.deletePassword(opts, function(err3) {
              if (err3) {
                fn(err3);
                return;
              }
              self.setPassword(opts, fn);
              return;
            });
          } else {
            var msg = "Security returned a non-successful error code: " + code;
            err2 = new KeychainAccess.errors.ServiceFailureError(msg);
            err2.exitCode = code;
            fn(err2);
            return;
          }
        } else {
          fn(null, opts.password);
        }
      });
    };
    KeychainAccess.prototype.deletePassword = function(opts, fn) {
      opts = opts || {};
      opts.type = (opts.type || "generic").toLowerCase();
      fn = fn || noop;
      var err2;
      if (process.platform !== "darwin") {
        err2 = new KeychainAccess.errors.UnsupportedPlatformError(null, process.platform);
        fn(err2, null);
        return;
      }
      if (!opts.account) {
        err2 = new KeychainAccess.errors.NoAccountProvidedError();
        fn(err2, null);
        return;
      }
      if (!opts.service) {
        err2 = new KeychainAccess.errors.NoServiceProvidedError();
        fn(err2, null);
        return;
      }
      var security = spawn(this.executablePath, ["delete-" + opts.type + "-password", "-a", opts.account, "-s", opts.service]);
      security.on("error", function(err3) {
        err3 = new KeychainAccess.errors.ServiceFailureError(null, err3.message);
        fn(err3, null);
        return;
      });
      security.on("close", function(code, signal) {
        if (code !== 0) {
          err2 = new KeychainAccess.errors.PasswordNotFoundError();
          fn(err2);
          return;
        }
        fn(null);
      });
    };
    KeychainAccess.prototype.createKeychain = function(opts, fn) {
      opts = opts || {};
      fn = fn || noop;
      if (!opts.keychainName) {
        err = new KeychainAccess.errors.NoKeychainNameProvidedError();
        fn(err, null);
        return;
      }
      if (!opts.password) {
        err = new KeychainAccess.errors.NoPasswordProvidedError();
        fn(err, null);
        return;
      }
      var security = spawn(this.executablePath, ["create-keychain", "-p", opts.password, opts.keychainName]);
      security.on("error", function(err2) {
        err2 = new KeychainAccess.errors.ServiceFailureError(null, err2.message);
        fn(err2, null);
        return;
      });
      security.on("close", function(code, signal) {
        if (code !== 0) {
          var msg = "Security returned a non-successful error code: " + code;
          err = new KeychainAccess.errors.ServiceFailureError(msg);
          err.exitCode = code;
          fn(err);
          return;
        } else {
          fn(null, opts.keychainName);
        }
      });
    };
    KeychainAccess.prototype.deleteKeychain = function(opts, fn) {
      opts = opts || {};
      fn = fn || noop;
      if (!opts.keychainName) {
        err = new KeychainAccess.errors.NoKeychainNameProvidedError();
        fn(err, null);
        return;
      }
      var security = spawn(this.executablePath, ["delete-keychain", opts.keychainName]);
      security.on("error", function(err2) {
        err2 = new KeychainAccess.errors.ServiceFailureError(null, err2.message);
        fn(err2, null);
        return;
      });
      security.on("close", function(code, signal) {
        if (code !== 0) {
          var msg = "Security returned a non-successful error code: " + code;
          err = new KeychainAccess.errors.ServiceFailureError(msg);
          err.exitCode = code;
          fn(err);
          return;
        } else {
          fn(null, opts.keychainName);
        }
      });
    };
    KeychainAccess.prototype.setDefaultKeychain = function(opts, fn) {
      opts = opts || {};
      fn = fn || noop;
      if (!opts.keychainName) {
        err = new KeychainAccess.errors.NoKeychainNameProvidedError();
        fn(err, null);
        return;
      }
      var security = spawn(this.executablePath, ["default-keychain", "-s", opts.keychainName]);
      security.on("error", function(err2) {
        err2 = new KeychainAccess.errors.ServiceFailureError(null, err2.message);
        fn(err2, null);
        return;
      });
      security.on("close", function(code, signal) {
        if (code !== 0) {
          var msg = "Security returned a non-successful error code: " + code;
          err = new KeychainAccess.errors.ServiceFailureError(msg);
          err.exitCode = code;
          fn(err);
          return;
        } else {
          fn(null, opts.keychainName);
        }
      });
    };
    function errorClass(code, defaultMsg) {
      var errorType = code + "Error";
      var ErrorClass = function(msg, append) {
        this.type = errorType;
        this.code = code;
        this.message = (msg || defaultMsg) + (append || "");
        this.stack = new Error().stack;
      };
      ErrorClass.prototype = Object.create(Error.prototype);
      ErrorClass.prototype.constructor = ErrorClass;
      KeychainAccess.errors[errorType] = ErrorClass;
    }
    KeychainAccess.errors = {};
    errorClass("UnsupportedPlatform", "Expected darwin platform, got: ");
    errorClass("NoAccountProvided", "An account is required");
    errorClass("NoServiceProvided", "A service is required");
    errorClass("NoPasswordProvided", "A password is required");
    errorClass("ServiceFailure", "Keychain failed to start child process: ");
    errorClass("PasswordNotFound", "Could not find password");
    errorClass("NoKeychainNameProvided", "A keychain name is required");
    module2.exports = new KeychainAccess();
  }
});

// src/index.ts
var src_exports = {};
__export(src_exports, {
  plugin: () => plugin
});
module.exports = __toCommonJS(src_exports);
var import_keychain = __toESM(require_keychain());
var plugin = {
  templateFunctions: [{
    name: "keychain.getPassword",
    description: "Retrieve a password from the macOS keychain",
    args: [
      { title: "Service", type: "text", name: "service", label: "Service", required: true },
      { title: "Account", type: "text", name: "account", label: "Account", required: true },
      {
        title: "Type",
        type: "select",
        name: "type",
        label: "Type",
        options: [
          { label: "Generic", value: "generic" },
          { label: "Internet", value: "internet" }
        ],
        defaultValue: "generic"
      }
    ],
    async onRender(_ctx, args) {
      if (!args.values.service || !args.values.account) return null;
      try {
        return new Promise((resolve, reject) => {
          import_keychain.default.getPassword({
            account: args.values.account,
            service: args.values.service,
            type: args.values.type || "generic"
          }, (err2, password) => {
            if (err2) reject(err2);
            else resolve(password);
          });
        });
      } catch (err2) {
        return null;
      }
    }
  }]
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  plugin
});
/*! Bundled license information:

keychain/keychain.js:
  (*!
   * node-keychain
   * Copyright(c) 2023 Nicholas Penree <nick@penree.com>
   * MIT Licensed
   *)
*/
