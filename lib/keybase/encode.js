// Generated by IcedCoffeeScript 1.7.1-c
(function() {
  var K, SHA256, alloc, bufeq_secure, katch, null_hash, obj_extract, pack, purepack, read_base64, seal, unpack, unseal, _ref, _ref1;

  K = require('../const').kb;

  _ref = require('../hash'), alloc = _ref.alloc, SHA256 = _ref.SHA256;

  purepack = require('purepack');

  _ref1 = require('../util'), katch = _ref1.katch, obj_extract = _ref1.obj_extract, bufeq_secure = _ref1.bufeq_secure;

  null_hash = new Buffer(0);

  pack = function(x) {
    return purepack.pack(x, {
      sort_keys: true
    });
  };

  unpack = function(x) {
    return purepack.unpack(x, {
      strict: true
    });
  };

  seal = function(_arg) {
    var dohash, hasher, obj, oo, packed;
    obj = _arg.obj, dohash = _arg.dohash;
    hasher = SHA256;
    oo = {
      version: K.versions.V1,
      tag: obj.tag,
      body: obj.body
    };
    if (dohash) {
      oo.hash = {
        type: hasher.type,
        value: null_hash
      };
      packed = pack(oo);
      oo.hash.value = hasher(packed);
    }
    return pack(oo);
  };

  read_base64 = function(raw) {
    var parts;
    parts = (raw.split(/\s+/)).join('');
    return new Buffer(parts, 'base64');
  };

  unseal = function(buf) {
    var h, hasher, hv, oo, t, _ref2;
    oo = unpack(buf);
    if ((hv = oo != null ? (_ref2 = oo.hash) != null ? _ref2.value : void 0 : void 0) != null) {
      oo.hash.value = null_hash;
      hasher = alloc((t = oo.hash.type));
      if (hasher == null) {
        throw new Error("unknown hash algo: " + t);
      }
      h = hasher(pack(oo));
      if (!bufeq_secure(h, hv)) {
        throw new Error("hash mismatch");
      }
      if (oo.version !== K.versions.V1) {
        throw new Error("unknown version");
      }
    }
    return obj_extract(oo, ['tag', 'body']);
  };

  exports.seal = seal;

  exports.pack = pack;

  exports.unseal = unseal;

  exports.unpack = unpack;

  exports.read_base64 = read_base64;

}).call(this);
