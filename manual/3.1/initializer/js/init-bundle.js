var Bt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Jt(j) {
  return j && j.__esModule && Object.prototype.hasOwnProperty.call(j, "default") ? j.default : j;
}
function At(j) {
  throw new Error('Could not dynamically require "' + j + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var Zt = { exports: {} };
/*!

JSZip v3.10.1 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/main/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/main/LICENSE
*/
(function(j, O) {
  (function(d) {
    j.exports = d();
  })(function() {
    return function d(k, m, i) {
      function s(g, y) {
        if (!m[g]) {
          if (!k[g]) {
            var _ = typeof At == "function" && At;
            if (!y && _) return _(g, !0);
            if (n) return n(g, !0);
            var b = new Error("Cannot find module '" + g + "'");
            throw b.code = "MODULE_NOT_FOUND", b;
          }
          var a = m[g] = { exports: {} };
          k[g][0].call(a.exports, function(f) {
            var r = k[g][1][f];
            return s(r || f);
          }, a, a.exports, d, k, m, i);
        }
        return m[g].exports;
      }
      for (var n = typeof At == "function" && At, l = 0; l < i.length; l++) s(i[l]);
      return s;
    }({ 1: [function(d, k, m) {
      var i = d("./utils"), s = d("./support"), n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      m.encode = function(l) {
        for (var g, y, _, b, a, f, r, u = [], o = 0, p = l.length, w = p, S = i.getTypeOf(l) !== "string"; o < l.length; ) w = p - o, _ = S ? (g = l[o++], y = o < p ? l[o++] : 0, o < p ? l[o++] : 0) : (g = l.charCodeAt(o++), y = o < p ? l.charCodeAt(o++) : 0, o < p ? l.charCodeAt(o++) : 0), b = g >> 2, a = (3 & g) << 4 | y >> 4, f = 1 < w ? (15 & y) << 2 | _ >> 6 : 64, r = 2 < w ? 63 & _ : 64, u.push(n.charAt(b) + n.charAt(a) + n.charAt(f) + n.charAt(r));
        return u.join("");
      }, m.decode = function(l) {
        var g, y, _, b, a, f, r = 0, u = 0, o = "data:";
        if (l.substr(0, o.length) === o) throw new Error("Invalid base64 input, it looks like a data url.");
        var p, w = 3 * (l = l.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
        if (l.charAt(l.length - 1) === n.charAt(64) && w--, l.charAt(l.length - 2) === n.charAt(64) && w--, w % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
        for (p = s.uint8array ? new Uint8Array(0 | w) : new Array(0 | w); r < l.length; ) g = n.indexOf(l.charAt(r++)) << 2 | (b = n.indexOf(l.charAt(r++))) >> 4, y = (15 & b) << 4 | (a = n.indexOf(l.charAt(r++))) >> 2, _ = (3 & a) << 6 | (f = n.indexOf(l.charAt(r++))), p[u++] = g, a !== 64 && (p[u++] = y), f !== 64 && (p[u++] = _);
        return p;
      };
    }, { "./support": 30, "./utils": 32 }], 2: [function(d, k, m) {
      var i = d("./external"), s = d("./stream/DataWorker"), n = d("./stream/Crc32Probe"), l = d("./stream/DataLengthProbe");
      function g(y, _, b, a, f) {
        this.compressedSize = y, this.uncompressedSize = _, this.crc32 = b, this.compression = a, this.compressedContent = f;
      }
      g.prototype = { getContentWorker: function() {
        var y = new s(i.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new l("data_length")), _ = this;
        return y.on("end", function() {
          if (this.streamInfo.data_length !== _.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
        }), y;
      }, getCompressedWorker: function() {
        return new s(i.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
      } }, g.createWorkerFrom = function(y, _, b) {
        return y.pipe(new n()).pipe(new l("uncompressedSize")).pipe(_.compressWorker(b)).pipe(new l("compressedSize")).withStreamInfo("compression", _);
      }, k.exports = g;
    }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(d, k, m) {
      var i = d("./stream/GenericWorker");
      m.STORE = { magic: "\0\0", compressWorker: function() {
        return new i("STORE compression");
      }, uncompressWorker: function() {
        return new i("STORE decompression");
      } }, m.DEFLATE = d("./flate");
    }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(d, k, m) {
      var i = d("./utils"), s = function() {
        for (var n, l = [], g = 0; g < 256; g++) {
          n = g;
          for (var y = 0; y < 8; y++) n = 1 & n ? 3988292384 ^ n >>> 1 : n >>> 1;
          l[g] = n;
        }
        return l;
      }();
      k.exports = function(n, l) {
        return n !== void 0 && n.length ? i.getTypeOf(n) !== "string" ? function(g, y, _, b) {
          var a = s, f = b + _;
          g ^= -1;
          for (var r = b; r < f; r++) g = g >>> 8 ^ a[255 & (g ^ y[r])];
          return -1 ^ g;
        }(0 | l, n, n.length, 0) : function(g, y, _, b) {
          var a = s, f = b + _;
          g ^= -1;
          for (var r = b; r < f; r++) g = g >>> 8 ^ a[255 & (g ^ y.charCodeAt(r))];
          return -1 ^ g;
        }(0 | l, n, n.length, 0) : 0;
      };
    }, { "./utils": 32 }], 5: [function(d, k, m) {
      m.base64 = !1, m.binary = !1, m.dir = !1, m.createFolders = !0, m.date = null, m.compression = null, m.compressionOptions = null, m.comment = null, m.unixPermissions = null, m.dosPermissions = null;
    }, {}], 6: [function(d, k, m) {
      var i = null;
      i = typeof Promise < "u" ? Promise : d("lie"), k.exports = { Promise: i };
    }, { lie: 37 }], 7: [function(d, k, m) {
      var i = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Uint32Array < "u", s = d("pako"), n = d("./utils"), l = d("./stream/GenericWorker"), g = i ? "uint8array" : "array";
      function y(_, b) {
        l.call(this, "FlateWorker/" + _), this._pako = null, this._pakoAction = _, this._pakoOptions = b, this.meta = {};
      }
      m.magic = "\b\0", n.inherits(y, l), y.prototype.processChunk = function(_) {
        this.meta = _.meta, this._pako === null && this._createPako(), this._pako.push(n.transformTo(g, _.data), !1);
      }, y.prototype.flush = function() {
        l.prototype.flush.call(this), this._pako === null && this._createPako(), this._pako.push([], !0);
      }, y.prototype.cleanUp = function() {
        l.prototype.cleanUp.call(this), this._pako = null;
      }, y.prototype._createPako = function() {
        this._pako = new s[this._pakoAction]({ raw: !0, level: this._pakoOptions.level || -1 });
        var _ = this;
        this._pako.onData = function(b) {
          _.push({ data: b, meta: _.meta });
        };
      }, m.compressWorker = function(_) {
        return new y("Deflate", _);
      }, m.uncompressWorker = function() {
        return new y("Inflate", {});
      };
    }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(d, k, m) {
      function i(a, f) {
        var r, u = "";
        for (r = 0; r < f; r++) u += String.fromCharCode(255 & a), a >>>= 8;
        return u;
      }
      function s(a, f, r, u, o, p) {
        var w, S, E = a.file, D = a.compression, N = p !== g.utf8encode, M = n.transformTo("string", p(E.name)), P = n.transformTo("string", g.utf8encode(E.name)), q = E.comment, X = n.transformTo("string", p(q)), v = n.transformTo("string", g.utf8encode(q)), z = P.length !== E.name.length, e = v.length !== q.length, F = "", Q = "", L = "", tt = E.dir, W = E.date, J = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
        f && !r || (J.crc32 = a.crc32, J.compressedSize = a.compressedSize, J.uncompressedSize = a.uncompressedSize);
        var A = 0;
        f && (A |= 8), N || !z && !e || (A |= 2048);
        var B = 0, K = 0;
        tt && (B |= 16), o === "UNIX" ? (K = 798, B |= function($, at) {
          var ct = $;
          return $ || (ct = at ? 16893 : 33204), (65535 & ct) << 16;
        }(E.unixPermissions, tt)) : (K = 20, B |= function($) {
          return 63 & ($ || 0);
        }(E.dosPermissions)), w = W.getUTCHours(), w <<= 6, w |= W.getUTCMinutes(), w <<= 5, w |= W.getUTCSeconds() / 2, S = W.getUTCFullYear() - 1980, S <<= 4, S |= W.getUTCMonth() + 1, S <<= 5, S |= W.getUTCDate(), z && (Q = i(1, 1) + i(y(M), 4) + P, F += "up" + i(Q.length, 2) + Q), e && (L = i(1, 1) + i(y(X), 4) + v, F += "uc" + i(L.length, 2) + L);
        var G = "";
        return G += `
\0`, G += i(A, 2), G += D.magic, G += i(w, 2), G += i(S, 2), G += i(J.crc32, 4), G += i(J.compressedSize, 4), G += i(J.uncompressedSize, 4), G += i(M.length, 2), G += i(F.length, 2), { fileRecord: _.LOCAL_FILE_HEADER + G + M + F, dirRecord: _.CENTRAL_FILE_HEADER + i(K, 2) + G + i(X.length, 2) + "\0\0\0\0" + i(B, 4) + i(u, 4) + M + F + X };
      }
      var n = d("../utils"), l = d("../stream/GenericWorker"), g = d("../utf8"), y = d("../crc32"), _ = d("../signature");
      function b(a, f, r, u) {
        l.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = f, this.zipPlatform = r, this.encodeFileName = u, this.streamFiles = a, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
      }
      n.inherits(b, l), b.prototype.push = function(a) {
        var f = a.meta.percent || 0, r = this.entriesCount, u = this._sources.length;
        this.accumulate ? this.contentBuffer.push(a) : (this.bytesWritten += a.data.length, l.prototype.push.call(this, { data: a.data, meta: { currentFile: this.currentFile, percent: r ? (f + 100 * (r - u - 1)) / r : 100 } }));
      }, b.prototype.openedSource = function(a) {
        this.currentSourceOffset = this.bytesWritten, this.currentFile = a.file.name;
        var f = this.streamFiles && !a.file.dir;
        if (f) {
          var r = s(a, f, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
          this.push({ data: r.fileRecord, meta: { percent: 0 } });
        } else this.accumulate = !0;
      }, b.prototype.closedSource = function(a) {
        this.accumulate = !1;
        var f = this.streamFiles && !a.file.dir, r = s(a, f, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
        if (this.dirRecords.push(r.dirRecord), f) this.push({ data: function(u) {
          return _.DATA_DESCRIPTOR + i(u.crc32, 4) + i(u.compressedSize, 4) + i(u.uncompressedSize, 4);
        }(a), meta: { percent: 100 } });
        else for (this.push({ data: r.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; ) this.push(this.contentBuffer.shift());
        this.currentFile = null;
      }, b.prototype.flush = function() {
        for (var a = this.bytesWritten, f = 0; f < this.dirRecords.length; f++) this.push({ data: this.dirRecords[f], meta: { percent: 100 } });
        var r = this.bytesWritten - a, u = function(o, p, w, S, E) {
          var D = n.transformTo("string", E(S));
          return _.CENTRAL_DIRECTORY_END + "\0\0\0\0" + i(o, 2) + i(o, 2) + i(p, 4) + i(w, 4) + i(D.length, 2) + D;
        }(this.dirRecords.length, r, a, this.zipComment, this.encodeFileName);
        this.push({ data: u, meta: { percent: 100 } });
      }, b.prototype.prepareNextSource = function() {
        this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
      }, b.prototype.registerPrevious = function(a) {
        this._sources.push(a);
        var f = this;
        return a.on("data", function(r) {
          f.processChunk(r);
        }), a.on("end", function() {
          f.closedSource(f.previous.streamInfo), f._sources.length ? f.prepareNextSource() : f.end();
        }), a.on("error", function(r) {
          f.error(r);
        }), this;
      }, b.prototype.resume = function() {
        return !!l.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), !0) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), !0));
      }, b.prototype.error = function(a) {
        var f = this._sources;
        if (!l.prototype.error.call(this, a)) return !1;
        for (var r = 0; r < f.length; r++) try {
          f[r].error(a);
        } catch {
        }
        return !0;
      }, b.prototype.lock = function() {
        l.prototype.lock.call(this);
        for (var a = this._sources, f = 0; f < a.length; f++) a[f].lock();
      }, k.exports = b;
    }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(d, k, m) {
      var i = d("../compressions"), s = d("./ZipFileWorker");
      m.generateWorker = function(n, l, g) {
        var y = new s(l.streamFiles, g, l.platform, l.encodeFileName), _ = 0;
        try {
          n.forEach(function(b, a) {
            _++;
            var f = function(p, w) {
              var S = p || w, E = i[S];
              if (!E) throw new Error(S + " is not a valid compression method !");
              return E;
            }(a.options.compression, l.compression), r = a.options.compressionOptions || l.compressionOptions || {}, u = a.dir, o = a.date;
            a._compressWorker(f, r).withStreamInfo("file", { name: b, dir: u, date: o, comment: a.comment || "", unixPermissions: a.unixPermissions, dosPermissions: a.dosPermissions }).pipe(y);
          }), y.entriesCount = _;
        } catch (b) {
          y.error(b);
        }
        return y;
      };
    }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function(d, k, m) {
      function i() {
        if (!(this instanceof i)) return new i();
        if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
        this.files = /* @__PURE__ */ Object.create(null), this.comment = null, this.root = "", this.clone = function() {
          var s = new i();
          for (var n in this) typeof this[n] != "function" && (s[n] = this[n]);
          return s;
        };
      }
      (i.prototype = d("./object")).loadAsync = d("./load"), i.support = d("./support"), i.defaults = d("./defaults"), i.version = "3.10.1", i.loadAsync = function(s, n) {
        return new i().loadAsync(s, n);
      }, i.external = d("./external"), k.exports = i;
    }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(d, k, m) {
      var i = d("./utils"), s = d("./external"), n = d("./utf8"), l = d("./zipEntries"), g = d("./stream/Crc32Probe"), y = d("./nodejsUtils");
      function _(b) {
        return new s.Promise(function(a, f) {
          var r = b.decompressed.getContentWorker().pipe(new g());
          r.on("error", function(u) {
            f(u);
          }).on("end", function() {
            r.streamInfo.crc32 !== b.decompressed.crc32 ? f(new Error("Corrupted zip : CRC32 mismatch")) : a();
          }).resume();
        });
      }
      k.exports = function(b, a) {
        var f = this;
        return a = i.extend(a || {}, { base64: !1, checkCRC32: !1, optimizedBinaryString: !1, createFolders: !1, decodeFileName: n.utf8decode }), y.isNode && y.isStream(b) ? s.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : i.prepareContent("the loaded zip file", b, !0, a.optimizedBinaryString, a.base64).then(function(r) {
          var u = new l(a);
          return u.load(r), u;
        }).then(function(r) {
          var u = [s.Promise.resolve(r)], o = r.files;
          if (a.checkCRC32) for (var p = 0; p < o.length; p++) u.push(_(o[p]));
          return s.Promise.all(u);
        }).then(function(r) {
          for (var u = r.shift(), o = u.files, p = 0; p < o.length; p++) {
            var w = o[p], S = w.fileNameStr, E = i.resolve(w.fileNameStr);
            f.file(E, w.decompressed, { binary: !0, optimizedBinaryString: !0, date: w.date, dir: w.dir, comment: w.fileCommentStr.length ? w.fileCommentStr : null, unixPermissions: w.unixPermissions, dosPermissions: w.dosPermissions, createFolders: a.createFolders }), w.dir || (f.file(E).unsafeOriginalName = S);
          }
          return u.zipComment.length && (f.comment = u.zipComment), f;
        });
      };
    }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(d, k, m) {
      var i = d("../utils"), s = d("../stream/GenericWorker");
      function n(l, g) {
        s.call(this, "Nodejs stream input adapter for " + l), this._upstreamEnded = !1, this._bindStream(g);
      }
      i.inherits(n, s), n.prototype._bindStream = function(l) {
        var g = this;
        (this._stream = l).pause(), l.on("data", function(y) {
          g.push({ data: y, meta: { percent: 0 } });
        }).on("error", function(y) {
          g.isPaused ? this.generatedError = y : g.error(y);
        }).on("end", function() {
          g.isPaused ? g._upstreamEnded = !0 : g.end();
        });
      }, n.prototype.pause = function() {
        return !!s.prototype.pause.call(this) && (this._stream.pause(), !0);
      }, n.prototype.resume = function() {
        return !!s.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), !0);
      }, k.exports = n;
    }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(d, k, m) {
      var i = d("readable-stream").Readable;
      function s(n, l, g) {
        i.call(this, l), this._helper = n;
        var y = this;
        n.on("data", function(_, b) {
          y.push(_) || y._helper.pause(), g && g(b);
        }).on("error", function(_) {
          y.emit("error", _);
        }).on("end", function() {
          y.push(null);
        });
      }
      d("../utils").inherits(s, i), s.prototype._read = function() {
        this._helper.resume();
      }, k.exports = s;
    }, { "../utils": 32, "readable-stream": 16 }], 14: [function(d, k, m) {
      k.exports = { isNode: typeof Buffer < "u", newBufferFrom: function(i, s) {
        if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(i, s);
        if (typeof i == "number") throw new Error('The "data" argument must not be a number');
        return new Buffer(i, s);
      }, allocBuffer: function(i) {
        if (Buffer.alloc) return Buffer.alloc(i);
        var s = new Buffer(i);
        return s.fill(0), s;
      }, isBuffer: function(i) {
        return Buffer.isBuffer(i);
      }, isStream: function(i) {
        return i && typeof i.on == "function" && typeof i.pause == "function" && typeof i.resume == "function";
      } };
    }, {}], 15: [function(d, k, m) {
      function i(E, D, N) {
        var M, P = n.getTypeOf(D), q = n.extend(N || {}, y);
        q.date = q.date || /* @__PURE__ */ new Date(), q.compression !== null && (q.compression = q.compression.toUpperCase()), typeof q.unixPermissions == "string" && (q.unixPermissions = parseInt(q.unixPermissions, 8)), q.unixPermissions && 16384 & q.unixPermissions && (q.dir = !0), q.dosPermissions && 16 & q.dosPermissions && (q.dir = !0), q.dir && (E = o(E)), q.createFolders && (M = u(E)) && p.call(this, M, !0);
        var X = P === "string" && q.binary === !1 && q.base64 === !1;
        N && N.binary !== void 0 || (q.binary = !X), (D instanceof _ && D.uncompressedSize === 0 || q.dir || !D || D.length === 0) && (q.base64 = !1, q.binary = !0, D = "", q.compression = "STORE", P = "string");
        var v = null;
        v = D instanceof _ || D instanceof l ? D : f.isNode && f.isStream(D) ? new r(E, D) : n.prepareContent(E, D, q.binary, q.optimizedBinaryString, q.base64);
        var z = new b(E, v, q);
        this.files[E] = z;
      }
      var s = d("./utf8"), n = d("./utils"), l = d("./stream/GenericWorker"), g = d("./stream/StreamHelper"), y = d("./defaults"), _ = d("./compressedObject"), b = d("./zipObject"), a = d("./generate"), f = d("./nodejsUtils"), r = d("./nodejs/NodejsStreamInputAdapter"), u = function(E) {
        E.slice(-1) === "/" && (E = E.substring(0, E.length - 1));
        var D = E.lastIndexOf("/");
        return 0 < D ? E.substring(0, D) : "";
      }, o = function(E) {
        return E.slice(-1) !== "/" && (E += "/"), E;
      }, p = function(E, D) {
        return D = D !== void 0 ? D : y.createFolders, E = o(E), this.files[E] || i.call(this, E, null, { dir: !0, createFolders: D }), this.files[E];
      };
      function w(E) {
        return Object.prototype.toString.call(E) === "[object RegExp]";
      }
      var S = { load: function() {
        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
      }, forEach: function(E) {
        var D, N, M;
        for (D in this.files) M = this.files[D], (N = D.slice(this.root.length, D.length)) && D.slice(0, this.root.length) === this.root && E(N, M);
      }, filter: function(E) {
        var D = [];
        return this.forEach(function(N, M) {
          E(N, M) && D.push(M);
        }), D;
      }, file: function(E, D, N) {
        if (arguments.length !== 1) return E = this.root + E, i.call(this, E, D, N), this;
        if (w(E)) {
          var M = E;
          return this.filter(function(q, X) {
            return !X.dir && M.test(q);
          });
        }
        var P = this.files[this.root + E];
        return P && !P.dir ? P : null;
      }, folder: function(E) {
        if (!E) return this;
        if (w(E)) return this.filter(function(P, q) {
          return q.dir && E.test(P);
        });
        var D = this.root + E, N = p.call(this, D), M = this.clone();
        return M.root = N.name, M;
      }, remove: function(E) {
        E = this.root + E;
        var D = this.files[E];
        if (D || (E.slice(-1) !== "/" && (E += "/"), D = this.files[E]), D && !D.dir) delete this.files[E];
        else for (var N = this.filter(function(P, q) {
          return q.name.slice(0, E.length) === E;
        }), M = 0; M < N.length; M++) delete this.files[N[M].name];
        return this;
      }, generate: function() {
        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
      }, generateInternalStream: function(E) {
        var D, N = {};
        try {
          if ((N = n.extend(E || {}, { streamFiles: !1, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: s.utf8encode })).type = N.type.toLowerCase(), N.compression = N.compression.toUpperCase(), N.type === "binarystring" && (N.type = "string"), !N.type) throw new Error("No output type specified.");
          n.checkSupport(N.type), N.platform !== "darwin" && N.platform !== "freebsd" && N.platform !== "linux" && N.platform !== "sunos" || (N.platform = "UNIX"), N.platform === "win32" && (N.platform = "DOS");
          var M = N.comment || this.comment || "";
          D = a.generateWorker(this, N, M);
        } catch (P) {
          (D = new l("error")).error(P);
        }
        return new g(D, N.type || "string", N.mimeType);
      }, generateAsync: function(E, D) {
        return this.generateInternalStream(E).accumulate(D);
      }, generateNodeStream: function(E, D) {
        return (E = E || {}).type || (E.type = "nodebuffer"), this.generateInternalStream(E).toNodejsStream(D);
      } };
      k.exports = S;
    }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(d, k, m) {
      k.exports = d("stream");
    }, { stream: void 0 }], 17: [function(d, k, m) {
      var i = d("./DataReader");
      function s(n) {
        i.call(this, n);
        for (var l = 0; l < this.data.length; l++) n[l] = 255 & n[l];
      }
      d("../utils").inherits(s, i), s.prototype.byteAt = function(n) {
        return this.data[this.zero + n];
      }, s.prototype.lastIndexOfSignature = function(n) {
        for (var l = n.charCodeAt(0), g = n.charCodeAt(1), y = n.charCodeAt(2), _ = n.charCodeAt(3), b = this.length - 4; 0 <= b; --b) if (this.data[b] === l && this.data[b + 1] === g && this.data[b + 2] === y && this.data[b + 3] === _) return b - this.zero;
        return -1;
      }, s.prototype.readAndCheckSignature = function(n) {
        var l = n.charCodeAt(0), g = n.charCodeAt(1), y = n.charCodeAt(2), _ = n.charCodeAt(3), b = this.readData(4);
        return l === b[0] && g === b[1] && y === b[2] && _ === b[3];
      }, s.prototype.readData = function(n) {
        if (this.checkOffset(n), n === 0) return [];
        var l = this.data.slice(this.zero + this.index, this.zero + this.index + n);
        return this.index += n, l;
      }, k.exports = s;
    }, { "../utils": 32, "./DataReader": 18 }], 18: [function(d, k, m) {
      var i = d("../utils");
      function s(n) {
        this.data = n, this.length = n.length, this.index = 0, this.zero = 0;
      }
      s.prototype = { checkOffset: function(n) {
        this.checkIndex(this.index + n);
      }, checkIndex: function(n) {
        if (this.length < this.zero + n || n < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + n + "). Corrupted zip ?");
      }, setIndex: function(n) {
        this.checkIndex(n), this.index = n;
      }, skip: function(n) {
        this.setIndex(this.index + n);
      }, byteAt: function() {
      }, readInt: function(n) {
        var l, g = 0;
        for (this.checkOffset(n), l = this.index + n - 1; l >= this.index; l--) g = (g << 8) + this.byteAt(l);
        return this.index += n, g;
      }, readString: function(n) {
        return i.transformTo("string", this.readData(n));
      }, readData: function() {
      }, lastIndexOfSignature: function() {
      }, readAndCheckSignature: function() {
      }, readDate: function() {
        var n = this.readInt(4);
        return new Date(Date.UTC(1980 + (n >> 25 & 127), (n >> 21 & 15) - 1, n >> 16 & 31, n >> 11 & 31, n >> 5 & 63, (31 & n) << 1));
      } }, k.exports = s;
    }, { "../utils": 32 }], 19: [function(d, k, m) {
      var i = d("./Uint8ArrayReader");
      function s(n) {
        i.call(this, n);
      }
      d("../utils").inherits(s, i), s.prototype.readData = function(n) {
        this.checkOffset(n);
        var l = this.data.slice(this.zero + this.index, this.zero + this.index + n);
        return this.index += n, l;
      }, k.exports = s;
    }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(d, k, m) {
      var i = d("./DataReader");
      function s(n) {
        i.call(this, n);
      }
      d("../utils").inherits(s, i), s.prototype.byteAt = function(n) {
        return this.data.charCodeAt(this.zero + n);
      }, s.prototype.lastIndexOfSignature = function(n) {
        return this.data.lastIndexOf(n) - this.zero;
      }, s.prototype.readAndCheckSignature = function(n) {
        return n === this.readData(4);
      }, s.prototype.readData = function(n) {
        this.checkOffset(n);
        var l = this.data.slice(this.zero + this.index, this.zero + this.index + n);
        return this.index += n, l;
      }, k.exports = s;
    }, { "../utils": 32, "./DataReader": 18 }], 21: [function(d, k, m) {
      var i = d("./ArrayReader");
      function s(n) {
        i.call(this, n);
      }
      d("../utils").inherits(s, i), s.prototype.readData = function(n) {
        if (this.checkOffset(n), n === 0) return new Uint8Array(0);
        var l = this.data.subarray(this.zero + this.index, this.zero + this.index + n);
        return this.index += n, l;
      }, k.exports = s;
    }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(d, k, m) {
      var i = d("../utils"), s = d("../support"), n = d("./ArrayReader"), l = d("./StringReader"), g = d("./NodeBufferReader"), y = d("./Uint8ArrayReader");
      k.exports = function(_) {
        var b = i.getTypeOf(_);
        return i.checkSupport(b), b !== "string" || s.uint8array ? b === "nodebuffer" ? new g(_) : s.uint8array ? new y(i.transformTo("uint8array", _)) : new n(i.transformTo("array", _)) : new l(_);
      };
    }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(d, k, m) {
      m.LOCAL_FILE_HEADER = "PK", m.CENTRAL_FILE_HEADER = "PK", m.CENTRAL_DIRECTORY_END = "PK", m.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", m.ZIP64_CENTRAL_DIRECTORY_END = "PK", m.DATA_DESCRIPTOR = "PK\x07\b";
    }, {}], 24: [function(d, k, m) {
      var i = d("./GenericWorker"), s = d("../utils");
      function n(l) {
        i.call(this, "ConvertWorker to " + l), this.destType = l;
      }
      s.inherits(n, i), n.prototype.processChunk = function(l) {
        this.push({ data: s.transformTo(this.destType, l.data), meta: l.meta });
      }, k.exports = n;
    }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(d, k, m) {
      var i = d("./GenericWorker"), s = d("../crc32");
      function n() {
        i.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
      }
      d("../utils").inherits(n, i), n.prototype.processChunk = function(l) {
        this.streamInfo.crc32 = s(l.data, this.streamInfo.crc32 || 0), this.push(l);
      }, k.exports = n;
    }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(d, k, m) {
      var i = d("../utils"), s = d("./GenericWorker");
      function n(l) {
        s.call(this, "DataLengthProbe for " + l), this.propName = l, this.withStreamInfo(l, 0);
      }
      i.inherits(n, s), n.prototype.processChunk = function(l) {
        if (l) {
          var g = this.streamInfo[this.propName] || 0;
          this.streamInfo[this.propName] = g + l.data.length;
        }
        s.prototype.processChunk.call(this, l);
      }, k.exports = n;
    }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(d, k, m) {
      var i = d("../utils"), s = d("./GenericWorker");
      function n(l) {
        s.call(this, "DataWorker");
        var g = this;
        this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, l.then(function(y) {
          g.dataIsReady = !0, g.data = y, g.max = y && y.length || 0, g.type = i.getTypeOf(y), g.isPaused || g._tickAndRepeat();
        }, function(y) {
          g.error(y);
        });
      }
      i.inherits(n, s), n.prototype.cleanUp = function() {
        s.prototype.cleanUp.call(this), this.data = null;
      }, n.prototype.resume = function() {
        return !!s.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = !0, i.delay(this._tickAndRepeat, [], this)), !0);
      }, n.prototype._tickAndRepeat = function() {
        this._tickScheduled = !1, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (i.delay(this._tickAndRepeat, [], this), this._tickScheduled = !0));
      }, n.prototype._tick = function() {
        if (this.isPaused || this.isFinished) return !1;
        var l = null, g = Math.min(this.max, this.index + 16384);
        if (this.index >= this.max) return this.end();
        switch (this.type) {
          case "string":
            l = this.data.substring(this.index, g);
            break;
          case "uint8array":
            l = this.data.subarray(this.index, g);
            break;
          case "array":
          case "nodebuffer":
            l = this.data.slice(this.index, g);
        }
        return this.index = g, this.push({ data: l, meta: { percent: this.max ? this.index / this.max * 100 : 0 } });
      }, k.exports = n;
    }, { "../utils": 32, "./GenericWorker": 28 }], 28: [function(d, k, m) {
      function i(s) {
        this.name = s || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = !0, this.isFinished = !1, this.isLocked = !1, this._listeners = { data: [], end: [], error: [] }, this.previous = null;
      }
      i.prototype = { push: function(s) {
        this.emit("data", s);
      }, end: function() {
        if (this.isFinished) return !1;
        this.flush();
        try {
          this.emit("end"), this.cleanUp(), this.isFinished = !0;
        } catch (s) {
          this.emit("error", s);
        }
        return !0;
      }, error: function(s) {
        return !this.isFinished && (this.isPaused ? this.generatedError = s : (this.isFinished = !0, this.emit("error", s), this.previous && this.previous.error(s), this.cleanUp()), !0);
      }, on: function(s, n) {
        return this._listeners[s].push(n), this;
      }, cleanUp: function() {
        this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
      }, emit: function(s, n) {
        if (this._listeners[s]) for (var l = 0; l < this._listeners[s].length; l++) this._listeners[s][l].call(this, n);
      }, pipe: function(s) {
        return s.registerPrevious(this);
      }, registerPrevious: function(s) {
        if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
        this.streamInfo = s.streamInfo, this.mergeStreamInfo(), this.previous = s;
        var n = this;
        return s.on("data", function(l) {
          n.processChunk(l);
        }), s.on("end", function() {
          n.end();
        }), s.on("error", function(l) {
          n.error(l);
        }), this;
      }, pause: function() {
        return !this.isPaused && !this.isFinished && (this.isPaused = !0, this.previous && this.previous.pause(), !0);
      }, resume: function() {
        if (!this.isPaused || this.isFinished) return !1;
        var s = this.isPaused = !1;
        return this.generatedError && (this.error(this.generatedError), s = !0), this.previous && this.previous.resume(), !s;
      }, flush: function() {
      }, processChunk: function(s) {
        this.push(s);
      }, withStreamInfo: function(s, n) {
        return this.extraStreamInfo[s] = n, this.mergeStreamInfo(), this;
      }, mergeStreamInfo: function() {
        for (var s in this.extraStreamInfo) Object.prototype.hasOwnProperty.call(this.extraStreamInfo, s) && (this.streamInfo[s] = this.extraStreamInfo[s]);
      }, lock: function() {
        if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
        this.isLocked = !0, this.previous && this.previous.lock();
      }, toString: function() {
        var s = "Worker " + this.name;
        return this.previous ? this.previous + " -> " + s : s;
      } }, k.exports = i;
    }, {}], 29: [function(d, k, m) {
      var i = d("../utils"), s = d("./ConvertWorker"), n = d("./GenericWorker"), l = d("../base64"), g = d("../support"), y = d("../external"), _ = null;
      if (g.nodestream) try {
        _ = d("../nodejs/NodejsStreamOutputAdapter");
      } catch {
      }
      function b(f, r) {
        return new y.Promise(function(u, o) {
          var p = [], w = f._internalType, S = f._outputType, E = f._mimeType;
          f.on("data", function(D, N) {
            p.push(D), r && r(N);
          }).on("error", function(D) {
            p = [], o(D);
          }).on("end", function() {
            try {
              var D = function(N, M, P) {
                switch (N) {
                  case "blob":
                    return i.newBlob(i.transformTo("arraybuffer", M), P);
                  case "base64":
                    return l.encode(M);
                  default:
                    return i.transformTo(N, M);
                }
              }(S, function(N, M) {
                var P, q = 0, X = null, v = 0;
                for (P = 0; P < M.length; P++) v += M[P].length;
                switch (N) {
                  case "string":
                    return M.join("");
                  case "array":
                    return Array.prototype.concat.apply([], M);
                  case "uint8array":
                    for (X = new Uint8Array(v), P = 0; P < M.length; P++) X.set(M[P], q), q += M[P].length;
                    return X;
                  case "nodebuffer":
                    return Buffer.concat(M);
                  default:
                    throw new Error("concat : unsupported type '" + N + "'");
                }
              }(w, p), E);
              u(D);
            } catch (N) {
              o(N);
            }
            p = [];
          }).resume();
        });
      }
      function a(f, r, u) {
        var o = r;
        switch (r) {
          case "blob":
          case "arraybuffer":
            o = "uint8array";
            break;
          case "base64":
            o = "string";
        }
        try {
          this._internalType = o, this._outputType = r, this._mimeType = u, i.checkSupport(o), this._worker = f.pipe(new s(o)), f.lock();
        } catch (p) {
          this._worker = new n("error"), this._worker.error(p);
        }
      }
      a.prototype = { accumulate: function(f) {
        return b(this, f);
      }, on: function(f, r) {
        var u = this;
        return f === "data" ? this._worker.on(f, function(o) {
          r.call(u, o.data, o.meta);
        }) : this._worker.on(f, function() {
          i.delay(r, arguments, u);
        }), this;
      }, resume: function() {
        return i.delay(this._worker.resume, [], this._worker), this;
      }, pause: function() {
        return this._worker.pause(), this;
      }, toNodejsStream: function(f) {
        if (i.checkSupport("nodestream"), this._outputType !== "nodebuffer") throw new Error(this._outputType + " is not supported by this method");
        return new _(this, { objectMode: this._outputType !== "nodebuffer" }, f);
      } }, k.exports = a;
    }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function(d, k, m) {
      if (m.base64 = !0, m.array = !0, m.string = !0, m.arraybuffer = typeof ArrayBuffer < "u" && typeof Uint8Array < "u", m.nodebuffer = typeof Buffer < "u", m.uint8array = typeof Uint8Array < "u", typeof ArrayBuffer > "u") m.blob = !1;
      else {
        var i = new ArrayBuffer(0);
        try {
          m.blob = new Blob([i], { type: "application/zip" }).size === 0;
        } catch {
          try {
            var s = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
            s.append(i), m.blob = s.getBlob("application/zip").size === 0;
          } catch {
            m.blob = !1;
          }
        }
      }
      try {
        m.nodestream = !!d("readable-stream").Readable;
      } catch {
        m.nodestream = !1;
      }
    }, { "readable-stream": 16 }], 31: [function(d, k, m) {
      for (var i = d("./utils"), s = d("./support"), n = d("./nodejsUtils"), l = d("./stream/GenericWorker"), g = new Array(256), y = 0; y < 256; y++) g[y] = 252 <= y ? 6 : 248 <= y ? 5 : 240 <= y ? 4 : 224 <= y ? 3 : 192 <= y ? 2 : 1;
      g[254] = g[254] = 1;
      function _() {
        l.call(this, "utf-8 decode"), this.leftOver = null;
      }
      function b() {
        l.call(this, "utf-8 encode");
      }
      m.utf8encode = function(a) {
        return s.nodebuffer ? n.newBufferFrom(a, "utf-8") : function(f) {
          var r, u, o, p, w, S = f.length, E = 0;
          for (p = 0; p < S; p++) (64512 & (u = f.charCodeAt(p))) == 55296 && p + 1 < S && (64512 & (o = f.charCodeAt(p + 1))) == 56320 && (u = 65536 + (u - 55296 << 10) + (o - 56320), p++), E += u < 128 ? 1 : u < 2048 ? 2 : u < 65536 ? 3 : 4;
          for (r = s.uint8array ? new Uint8Array(E) : new Array(E), p = w = 0; w < E; p++) (64512 & (u = f.charCodeAt(p))) == 55296 && p + 1 < S && (64512 & (o = f.charCodeAt(p + 1))) == 56320 && (u = 65536 + (u - 55296 << 10) + (o - 56320), p++), u < 128 ? r[w++] = u : (u < 2048 ? r[w++] = 192 | u >>> 6 : (u < 65536 ? r[w++] = 224 | u >>> 12 : (r[w++] = 240 | u >>> 18, r[w++] = 128 | u >>> 12 & 63), r[w++] = 128 | u >>> 6 & 63), r[w++] = 128 | 63 & u);
          return r;
        }(a);
      }, m.utf8decode = function(a) {
        return s.nodebuffer ? i.transformTo("nodebuffer", a).toString("utf-8") : function(f) {
          var r, u, o, p, w = f.length, S = new Array(2 * w);
          for (r = u = 0; r < w; ) if ((o = f[r++]) < 128) S[u++] = o;
          else if (4 < (p = g[o])) S[u++] = 65533, r += p - 1;
          else {
            for (o &= p === 2 ? 31 : p === 3 ? 15 : 7; 1 < p && r < w; ) o = o << 6 | 63 & f[r++], p--;
            1 < p ? S[u++] = 65533 : o < 65536 ? S[u++] = o : (o -= 65536, S[u++] = 55296 | o >> 10 & 1023, S[u++] = 56320 | 1023 & o);
          }
          return S.length !== u && (S.subarray ? S = S.subarray(0, u) : S.length = u), i.applyFromCharCode(S);
        }(a = i.transformTo(s.uint8array ? "uint8array" : "array", a));
      }, i.inherits(_, l), _.prototype.processChunk = function(a) {
        var f = i.transformTo(s.uint8array ? "uint8array" : "array", a.data);
        if (this.leftOver && this.leftOver.length) {
          if (s.uint8array) {
            var r = f;
            (f = new Uint8Array(r.length + this.leftOver.length)).set(this.leftOver, 0), f.set(r, this.leftOver.length);
          } else f = this.leftOver.concat(f);
          this.leftOver = null;
        }
        var u = function(p, w) {
          var S;
          for ((w = w || p.length) > p.length && (w = p.length), S = w - 1; 0 <= S && (192 & p[S]) == 128; ) S--;
          return S < 0 || S === 0 ? w : S + g[p[S]] > w ? S : w;
        }(f), o = f;
        u !== f.length && (s.uint8array ? (o = f.subarray(0, u), this.leftOver = f.subarray(u, f.length)) : (o = f.slice(0, u), this.leftOver = f.slice(u, f.length))), this.push({ data: m.utf8decode(o), meta: a.meta });
      }, _.prototype.flush = function() {
        this.leftOver && this.leftOver.length && (this.push({ data: m.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
      }, m.Utf8DecodeWorker = _, i.inherits(b, l), b.prototype.processChunk = function(a) {
        this.push({ data: m.utf8encode(a.data), meta: a.meta });
      }, m.Utf8EncodeWorker = b;
    }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(d, k, m) {
      var i = d("./support"), s = d("./base64"), n = d("./nodejsUtils"), l = d("./external");
      function g(r) {
        return r;
      }
      function y(r, u) {
        for (var o = 0; o < r.length; ++o) u[o] = 255 & r.charCodeAt(o);
        return u;
      }
      d("setimmediate"), m.newBlob = function(r, u) {
        m.checkSupport("blob");
        try {
          return new Blob([r], { type: u });
        } catch {
          try {
            var o = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
            return o.append(r), o.getBlob(u);
          } catch {
            throw new Error("Bug : can't construct the Blob.");
          }
        }
      };
      var _ = { stringifyByChunk: function(r, u, o) {
        var p = [], w = 0, S = r.length;
        if (S <= o) return String.fromCharCode.apply(null, r);
        for (; w < S; ) u === "array" || u === "nodebuffer" ? p.push(String.fromCharCode.apply(null, r.slice(w, Math.min(w + o, S)))) : p.push(String.fromCharCode.apply(null, r.subarray(w, Math.min(w + o, S)))), w += o;
        return p.join("");
      }, stringifyByChar: function(r) {
        for (var u = "", o = 0; o < r.length; o++) u += String.fromCharCode(r[o]);
        return u;
      }, applyCanBeUsed: { uint8array: function() {
        try {
          return i.uint8array && String.fromCharCode.apply(null, new Uint8Array(1)).length === 1;
        } catch {
          return !1;
        }
      }(), nodebuffer: function() {
        try {
          return i.nodebuffer && String.fromCharCode.apply(null, n.allocBuffer(1)).length === 1;
        } catch {
          return !1;
        }
      }() } };
      function b(r) {
        var u = 65536, o = m.getTypeOf(r), p = !0;
        if (o === "uint8array" ? p = _.applyCanBeUsed.uint8array : o === "nodebuffer" && (p = _.applyCanBeUsed.nodebuffer), p) for (; 1 < u; ) try {
          return _.stringifyByChunk(r, o, u);
        } catch {
          u = Math.floor(u / 2);
        }
        return _.stringifyByChar(r);
      }
      function a(r, u) {
        for (var o = 0; o < r.length; o++) u[o] = r[o];
        return u;
      }
      m.applyFromCharCode = b;
      var f = {};
      f.string = { string: g, array: function(r) {
        return y(r, new Array(r.length));
      }, arraybuffer: function(r) {
        return f.string.uint8array(r).buffer;
      }, uint8array: function(r) {
        return y(r, new Uint8Array(r.length));
      }, nodebuffer: function(r) {
        return y(r, n.allocBuffer(r.length));
      } }, f.array = { string: b, array: g, arraybuffer: function(r) {
        return new Uint8Array(r).buffer;
      }, uint8array: function(r) {
        return new Uint8Array(r);
      }, nodebuffer: function(r) {
        return n.newBufferFrom(r);
      } }, f.arraybuffer = { string: function(r) {
        return b(new Uint8Array(r));
      }, array: function(r) {
        return a(new Uint8Array(r), new Array(r.byteLength));
      }, arraybuffer: g, uint8array: function(r) {
        return new Uint8Array(r);
      }, nodebuffer: function(r) {
        return n.newBufferFrom(new Uint8Array(r));
      } }, f.uint8array = { string: b, array: function(r) {
        return a(r, new Array(r.length));
      }, arraybuffer: function(r) {
        return r.buffer;
      }, uint8array: g, nodebuffer: function(r) {
        return n.newBufferFrom(r);
      } }, f.nodebuffer = { string: b, array: function(r) {
        return a(r, new Array(r.length));
      }, arraybuffer: function(r) {
        return f.nodebuffer.uint8array(r).buffer;
      }, uint8array: function(r) {
        return a(r, new Uint8Array(r.length));
      }, nodebuffer: g }, m.transformTo = function(r, u) {
        if (u = u || "", !r) return u;
        m.checkSupport(r);
        var o = m.getTypeOf(u);
        return f[o][r](u);
      }, m.resolve = function(r) {
        for (var u = r.split("/"), o = [], p = 0; p < u.length; p++) {
          var w = u[p];
          w === "." || w === "" && p !== 0 && p !== u.length - 1 || (w === ".." ? o.pop() : o.push(w));
        }
        return o.join("/");
      }, m.getTypeOf = function(r) {
        return typeof r == "string" ? "string" : Object.prototype.toString.call(r) === "[object Array]" ? "array" : i.nodebuffer && n.isBuffer(r) ? "nodebuffer" : i.uint8array && r instanceof Uint8Array ? "uint8array" : i.arraybuffer && r instanceof ArrayBuffer ? "arraybuffer" : void 0;
      }, m.checkSupport = function(r) {
        if (!i[r.toLowerCase()]) throw new Error(r + " is not supported by this platform");
      }, m.MAX_VALUE_16BITS = 65535, m.MAX_VALUE_32BITS = -1, m.pretty = function(r) {
        var u, o, p = "";
        for (o = 0; o < (r || "").length; o++) p += "\\x" + ((u = r.charCodeAt(o)) < 16 ? "0" : "") + u.toString(16).toUpperCase();
        return p;
      }, m.delay = function(r, u, o) {
        setImmediate(function() {
          r.apply(o || null, u || []);
        });
      }, m.inherits = function(r, u) {
        function o() {
        }
        o.prototype = u.prototype, r.prototype = new o();
      }, m.extend = function() {
        var r, u, o = {};
        for (r = 0; r < arguments.length; r++) for (u in arguments[r]) Object.prototype.hasOwnProperty.call(arguments[r], u) && o[u] === void 0 && (o[u] = arguments[r][u]);
        return o;
      }, m.prepareContent = function(r, u, o, p, w) {
        return l.Promise.resolve(u).then(function(S) {
          return i.blob && (S instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(S)) !== -1) && typeof FileReader < "u" ? new l.Promise(function(E, D) {
            var N = new FileReader();
            N.onload = function(M) {
              E(M.target.result);
            }, N.onerror = function(M) {
              D(M.target.error);
            }, N.readAsArrayBuffer(S);
          }) : S;
        }).then(function(S) {
          var E = m.getTypeOf(S);
          return E ? (E === "arraybuffer" ? S = m.transformTo("uint8array", S) : E === "string" && (w ? S = s.decode(S) : o && p !== !0 && (S = function(D) {
            return y(D, i.uint8array ? new Uint8Array(D.length) : new Array(D.length));
          }(S))), S) : l.Promise.reject(new Error("Can't read the data of '" + r + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
        });
      };
    }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(d, k, m) {
      var i = d("./reader/readerFor"), s = d("./utils"), n = d("./signature"), l = d("./zipEntry"), g = d("./support");
      function y(_) {
        this.files = [], this.loadOptions = _;
      }
      y.prototype = { checkSignature: function(_) {
        if (!this.reader.readAndCheckSignature(_)) {
          this.reader.index -= 4;
          var b = this.reader.readString(4);
          throw new Error("Corrupted zip or bug: unexpected signature (" + s.pretty(b) + ", expected " + s.pretty(_) + ")");
        }
      }, isSignature: function(_, b) {
        var a = this.reader.index;
        this.reader.setIndex(_);
        var f = this.reader.readString(4) === b;
        return this.reader.setIndex(a), f;
      }, readBlockEndOfCentral: function() {
        this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
        var _ = this.reader.readData(this.zipCommentLength), b = g.uint8array ? "uint8array" : "array", a = s.transformTo(b, _);
        this.zipComment = this.loadOptions.decodeFileName(a);
      }, readBlockZip64EndOfCentral: function() {
        this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
        for (var _, b, a, f = this.zip64EndOfCentralSize - 44; 0 < f; ) _ = this.reader.readInt(2), b = this.reader.readInt(4), a = this.reader.readData(b), this.zip64ExtensibleData[_] = { id: _, length: b, value: a };
      }, readBlockZip64EndOfCentralLocator: function() {
        if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported");
      }, readLocalFiles: function() {
        var _, b;
        for (_ = 0; _ < this.files.length; _++) b = this.files[_], this.reader.setIndex(b.localHeaderOffset), this.checkSignature(n.LOCAL_FILE_HEADER), b.readLocalPart(this.reader), b.handleUTF8(), b.processAttributes();
      }, readCentralDir: function() {
        var _;
        for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(n.CENTRAL_FILE_HEADER); ) (_ = new l({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(_);
        if (this.centralDirRecords !== this.files.length && this.centralDirRecords !== 0 && this.files.length === 0) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
      }, readEndOfCentral: function() {
        var _ = this.reader.lastIndexOfSignature(n.CENTRAL_DIRECTORY_END);
        if (_ < 0) throw this.isSignature(0, n.LOCAL_FILE_HEADER) ? new Error("Corrupted zip: can't find end of central directory") : new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
        this.reader.setIndex(_);
        var b = _;
        if (this.checkSignature(n.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === s.MAX_VALUE_16BITS || this.diskWithCentralDirStart === s.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === s.MAX_VALUE_16BITS || this.centralDirRecords === s.MAX_VALUE_16BITS || this.centralDirSize === s.MAX_VALUE_32BITS || this.centralDirOffset === s.MAX_VALUE_32BITS) {
          if (this.zip64 = !0, (_ = this.reader.lastIndexOfSignature(n.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
          if (this.reader.setIndex(_), this.checkSignature(n.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, n.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(n.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
          this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(n.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
        }
        var a = this.centralDirOffset + this.centralDirSize;
        this.zip64 && (a += 20, a += 12 + this.zip64EndOfCentralSize);
        var f = b - a;
        if (0 < f) this.isSignature(b, n.CENTRAL_FILE_HEADER) || (this.reader.zero = f);
        else if (f < 0) throw new Error("Corrupted zip: missing " + Math.abs(f) + " bytes.");
      }, prepareReader: function(_) {
        this.reader = i(_);
      }, load: function(_) {
        this.prepareReader(_), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
      } }, k.exports = y;
    }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(d, k, m) {
      var i = d("./reader/readerFor"), s = d("./utils"), n = d("./compressedObject"), l = d("./crc32"), g = d("./utf8"), y = d("./compressions"), _ = d("./support");
      function b(a, f) {
        this.options = a, this.loadOptions = f;
      }
      b.prototype = { isEncrypted: function() {
        return (1 & this.bitFlag) == 1;
      }, useUTF8: function() {
        return (2048 & this.bitFlag) == 2048;
      }, readLocalPart: function(a) {
        var f, r;
        if (a.skip(22), this.fileNameLength = a.readInt(2), r = a.readInt(2), this.fileName = a.readData(this.fileNameLength), a.skip(r), this.compressedSize === -1 || this.uncompressedSize === -1) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
        if ((f = function(u) {
          for (var o in y) if (Object.prototype.hasOwnProperty.call(y, o) && y[o].magic === u) return y[o];
          return null;
        }(this.compressionMethod)) === null) throw new Error("Corrupted zip : compression " + s.pretty(this.compressionMethod) + " unknown (inner file : " + s.transformTo("string", this.fileName) + ")");
        this.decompressed = new n(this.compressedSize, this.uncompressedSize, this.crc32, f, a.readData(this.compressedSize));
      }, readCentralPart: function(a) {
        this.versionMadeBy = a.readInt(2), a.skip(2), this.bitFlag = a.readInt(2), this.compressionMethod = a.readString(2), this.date = a.readDate(), this.crc32 = a.readInt(4), this.compressedSize = a.readInt(4), this.uncompressedSize = a.readInt(4);
        var f = a.readInt(2);
        if (this.extraFieldsLength = a.readInt(2), this.fileCommentLength = a.readInt(2), this.diskNumberStart = a.readInt(2), this.internalFileAttributes = a.readInt(2), this.externalFileAttributes = a.readInt(4), this.localHeaderOffset = a.readInt(4), this.isEncrypted()) throw new Error("Encrypted zip are not supported");
        a.skip(f), this.readExtraFields(a), this.parseZIP64ExtraField(a), this.fileComment = a.readData(this.fileCommentLength);
      }, processAttributes: function() {
        this.unixPermissions = null, this.dosPermissions = null;
        var a = this.versionMadeBy >> 8;
        this.dir = !!(16 & this.externalFileAttributes), a == 0 && (this.dosPermissions = 63 & this.externalFileAttributes), a == 3 && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || this.fileNameStr.slice(-1) !== "/" || (this.dir = !0);
      }, parseZIP64ExtraField: function() {
        if (this.extraFields[1]) {
          var a = i(this.extraFields[1].value);
          this.uncompressedSize === s.MAX_VALUE_32BITS && (this.uncompressedSize = a.readInt(8)), this.compressedSize === s.MAX_VALUE_32BITS && (this.compressedSize = a.readInt(8)), this.localHeaderOffset === s.MAX_VALUE_32BITS && (this.localHeaderOffset = a.readInt(8)), this.diskNumberStart === s.MAX_VALUE_32BITS && (this.diskNumberStart = a.readInt(4));
        }
      }, readExtraFields: function(a) {
        var f, r, u, o = a.index + this.extraFieldsLength;
        for (this.extraFields || (this.extraFields = {}); a.index + 4 < o; ) f = a.readInt(2), r = a.readInt(2), u = a.readData(r), this.extraFields[f] = { id: f, length: r, value: u };
        a.setIndex(o);
      }, handleUTF8: function() {
        var a = _.uint8array ? "uint8array" : "array";
        if (this.useUTF8()) this.fileNameStr = g.utf8decode(this.fileName), this.fileCommentStr = g.utf8decode(this.fileComment);
        else {
          var f = this.findExtraFieldUnicodePath();
          if (f !== null) this.fileNameStr = f;
          else {
            var r = s.transformTo(a, this.fileName);
            this.fileNameStr = this.loadOptions.decodeFileName(r);
          }
          var u = this.findExtraFieldUnicodeComment();
          if (u !== null) this.fileCommentStr = u;
          else {
            var o = s.transformTo(a, this.fileComment);
            this.fileCommentStr = this.loadOptions.decodeFileName(o);
          }
        }
      }, findExtraFieldUnicodePath: function() {
        var a = this.extraFields[28789];
        if (a) {
          var f = i(a.value);
          return f.readInt(1) !== 1 || l(this.fileName) !== f.readInt(4) ? null : g.utf8decode(f.readData(a.length - 5));
        }
        return null;
      }, findExtraFieldUnicodeComment: function() {
        var a = this.extraFields[25461];
        if (a) {
          var f = i(a.value);
          return f.readInt(1) !== 1 || l(this.fileComment) !== f.readInt(4) ? null : g.utf8decode(f.readData(a.length - 5));
        }
        return null;
      } }, k.exports = b;
    }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(d, k, m) {
      function i(f, r, u) {
        this.name = f, this.dir = u.dir, this.date = u.date, this.comment = u.comment, this.unixPermissions = u.unixPermissions, this.dosPermissions = u.dosPermissions, this._data = r, this._dataBinary = u.binary, this.options = { compression: u.compression, compressionOptions: u.compressionOptions };
      }
      var s = d("./stream/StreamHelper"), n = d("./stream/DataWorker"), l = d("./utf8"), g = d("./compressedObject"), y = d("./stream/GenericWorker");
      i.prototype = { internalStream: function(f) {
        var r = null, u = "string";
        try {
          if (!f) throw new Error("No output type specified.");
          var o = (u = f.toLowerCase()) === "string" || u === "text";
          u !== "binarystring" && u !== "text" || (u = "string"), r = this._decompressWorker();
          var p = !this._dataBinary;
          p && !o && (r = r.pipe(new l.Utf8EncodeWorker())), !p && o && (r = r.pipe(new l.Utf8DecodeWorker()));
        } catch (w) {
          (r = new y("error")).error(w);
        }
        return new s(r, u, "");
      }, async: function(f, r) {
        return this.internalStream(f).accumulate(r);
      }, nodeStream: function(f, r) {
        return this.internalStream(f || "nodebuffer").toNodejsStream(r);
      }, _compressWorker: function(f, r) {
        if (this._data instanceof g && this._data.compression.magic === f.magic) return this._data.getCompressedWorker();
        var u = this._decompressWorker();
        return this._dataBinary || (u = u.pipe(new l.Utf8EncodeWorker())), g.createWorkerFrom(u, f, r);
      }, _decompressWorker: function() {
        return this._data instanceof g ? this._data.getContentWorker() : this._data instanceof y ? this._data : new n(this._data);
      } };
      for (var _ = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], b = function() {
        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
      }, a = 0; a < _.length; a++) i.prototype[_[a]] = b;
      k.exports = i;
    }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(d, k, m) {
      (function(i) {
        var s, n, l = i.MutationObserver || i.WebKitMutationObserver;
        if (l) {
          var g = 0, y = new l(f), _ = i.document.createTextNode("");
          y.observe(_, { characterData: !0 }), s = function() {
            _.data = g = ++g % 2;
          };
        } else if (i.setImmediate || i.MessageChannel === void 0) s = "document" in i && "onreadystatechange" in i.document.createElement("script") ? function() {
          var r = i.document.createElement("script");
          r.onreadystatechange = function() {
            f(), r.onreadystatechange = null, r.parentNode.removeChild(r), r = null;
          }, i.document.documentElement.appendChild(r);
        } : function() {
          setTimeout(f, 0);
        };
        else {
          var b = new i.MessageChannel();
          b.port1.onmessage = f, s = function() {
            b.port2.postMessage(0);
          };
        }
        var a = [];
        function f() {
          var r, u;
          n = !0;
          for (var o = a.length; o; ) {
            for (u = a, a = [], r = -1; ++r < o; ) u[r]();
            o = a.length;
          }
          n = !1;
        }
        k.exports = function(r) {
          a.push(r) !== 1 || n || s();
        };
      }).call(this, typeof Bt < "u" ? Bt : typeof self < "u" ? self : typeof window < "u" ? window : {});
    }, {}], 37: [function(d, k, m) {
      var i = d("immediate");
      function s() {
      }
      var n = {}, l = ["REJECTED"], g = ["FULFILLED"], y = ["PENDING"];
      function _(o) {
        if (typeof o != "function") throw new TypeError("resolver must be a function");
        this.state = y, this.queue = [], this.outcome = void 0, o !== s && r(this, o);
      }
      function b(o, p, w) {
        this.promise = o, typeof p == "function" && (this.onFulfilled = p, this.callFulfilled = this.otherCallFulfilled), typeof w == "function" && (this.onRejected = w, this.callRejected = this.otherCallRejected);
      }
      function a(o, p, w) {
        i(function() {
          var S;
          try {
            S = p(w);
          } catch (E) {
            return n.reject(o, E);
          }
          S === o ? n.reject(o, new TypeError("Cannot resolve promise with itself")) : n.resolve(o, S);
        });
      }
      function f(o) {
        var p = o && o.then;
        if (o && (typeof o == "object" || typeof o == "function") && typeof p == "function") return function() {
          p.apply(o, arguments);
        };
      }
      function r(o, p) {
        var w = !1;
        function S(N) {
          w || (w = !0, n.reject(o, N));
        }
        function E(N) {
          w || (w = !0, n.resolve(o, N));
        }
        var D = u(function() {
          p(E, S);
        });
        D.status === "error" && S(D.value);
      }
      function u(o, p) {
        var w = {};
        try {
          w.value = o(p), w.status = "success";
        } catch (S) {
          w.status = "error", w.value = S;
        }
        return w;
      }
      (k.exports = _).prototype.finally = function(o) {
        if (typeof o != "function") return this;
        var p = this.constructor;
        return this.then(function(w) {
          return p.resolve(o()).then(function() {
            return w;
          });
        }, function(w) {
          return p.resolve(o()).then(function() {
            throw w;
          });
        });
      }, _.prototype.catch = function(o) {
        return this.then(null, o);
      }, _.prototype.then = function(o, p) {
        if (typeof o != "function" && this.state === g || typeof p != "function" && this.state === l) return this;
        var w = new this.constructor(s);
        return this.state !== y ? a(w, this.state === g ? o : p, this.outcome) : this.queue.push(new b(w, o, p)), w;
      }, b.prototype.callFulfilled = function(o) {
        n.resolve(this.promise, o);
      }, b.prototype.otherCallFulfilled = function(o) {
        a(this.promise, this.onFulfilled, o);
      }, b.prototype.callRejected = function(o) {
        n.reject(this.promise, o);
      }, b.prototype.otherCallRejected = function(o) {
        a(this.promise, this.onRejected, o);
      }, n.resolve = function(o, p) {
        var w = u(f, p);
        if (w.status === "error") return n.reject(o, w.value);
        var S = w.value;
        if (S) r(o, S);
        else {
          o.state = g, o.outcome = p;
          for (var E = -1, D = o.queue.length; ++E < D; ) o.queue[E].callFulfilled(p);
        }
        return o;
      }, n.reject = function(o, p) {
        o.state = l, o.outcome = p;
        for (var w = -1, S = o.queue.length; ++w < S; ) o.queue[w].callRejected(p);
        return o;
      }, _.resolve = function(o) {
        return o instanceof this ? o : n.resolve(new this(s), o);
      }, _.reject = function(o) {
        var p = new this(s);
        return n.reject(p, o);
      }, _.all = function(o) {
        var p = this;
        if (Object.prototype.toString.call(o) !== "[object Array]") return this.reject(new TypeError("must be an array"));
        var w = o.length, S = !1;
        if (!w) return this.resolve([]);
        for (var E = new Array(w), D = 0, N = -1, M = new this(s); ++N < w; ) P(o[N], N);
        return M;
        function P(q, X) {
          p.resolve(q).then(function(v) {
            E[X] = v, ++D !== w || S || (S = !0, n.resolve(M, E));
          }, function(v) {
            S || (S = !0, n.reject(M, v));
          });
        }
      }, _.race = function(o) {
        var p = this;
        if (Object.prototype.toString.call(o) !== "[object Array]") return this.reject(new TypeError("must be an array"));
        var w = o.length, S = !1;
        if (!w) return this.resolve([]);
        for (var E = -1, D = new this(s); ++E < w; ) N = o[E], p.resolve(N).then(function(M) {
          S || (S = !0, n.resolve(D, M));
        }, function(M) {
          S || (S = !0, n.reject(D, M));
        });
        var N;
        return D;
      };
    }, { immediate: 36 }], 38: [function(d, k, m) {
      var i = {};
      (0, d("./lib/utils/common").assign)(i, d("./lib/deflate"), d("./lib/inflate"), d("./lib/zlib/constants")), k.exports = i;
    }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(d, k, m) {
      var i = d("./zlib/deflate"), s = d("./utils/common"), n = d("./utils/strings"), l = d("./zlib/messages"), g = d("./zlib/zstream"), y = Object.prototype.toString, _ = 0, b = -1, a = 0, f = 8;
      function r(o) {
        if (!(this instanceof r)) return new r(o);
        this.options = s.assign({ level: b, method: f, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: a, to: "" }, o || {});
        var p = this.options;
        p.raw && 0 < p.windowBits ? p.windowBits = -p.windowBits : p.gzip && 0 < p.windowBits && p.windowBits < 16 && (p.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new g(), this.strm.avail_out = 0;
        var w = i.deflateInit2(this.strm, p.level, p.method, p.windowBits, p.memLevel, p.strategy);
        if (w !== _) throw new Error(l[w]);
        if (p.header && i.deflateSetHeader(this.strm, p.header), p.dictionary) {
          var S;
          if (S = typeof p.dictionary == "string" ? n.string2buf(p.dictionary) : y.call(p.dictionary) === "[object ArrayBuffer]" ? new Uint8Array(p.dictionary) : p.dictionary, (w = i.deflateSetDictionary(this.strm, S)) !== _) throw new Error(l[w]);
          this._dict_set = !0;
        }
      }
      function u(o, p) {
        var w = new r(p);
        if (w.push(o, !0), w.err) throw w.msg || l[w.err];
        return w.result;
      }
      r.prototype.push = function(o, p) {
        var w, S, E = this.strm, D = this.options.chunkSize;
        if (this.ended) return !1;
        S = p === ~~p ? p : p === !0 ? 4 : 0, typeof o == "string" ? E.input = n.string2buf(o) : y.call(o) === "[object ArrayBuffer]" ? E.input = new Uint8Array(o) : E.input = o, E.next_in = 0, E.avail_in = E.input.length;
        do {
          if (E.avail_out === 0 && (E.output = new s.Buf8(D), E.next_out = 0, E.avail_out = D), (w = i.deflate(E, S)) !== 1 && w !== _) return this.onEnd(w), !(this.ended = !0);
          E.avail_out !== 0 && (E.avail_in !== 0 || S !== 4 && S !== 2) || (this.options.to === "string" ? this.onData(n.buf2binstring(s.shrinkBuf(E.output, E.next_out))) : this.onData(s.shrinkBuf(E.output, E.next_out)));
        } while ((0 < E.avail_in || E.avail_out === 0) && w !== 1);
        return S === 4 ? (w = i.deflateEnd(this.strm), this.onEnd(w), this.ended = !0, w === _) : S !== 2 || (this.onEnd(_), !(E.avail_out = 0));
      }, r.prototype.onData = function(o) {
        this.chunks.push(o);
      }, r.prototype.onEnd = function(o) {
        o === _ && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = s.flattenChunks(this.chunks)), this.chunks = [], this.err = o, this.msg = this.strm.msg;
      }, m.Deflate = r, m.deflate = u, m.deflateRaw = function(o, p) {
        return (p = p || {}).raw = !0, u(o, p);
      }, m.gzip = function(o, p) {
        return (p = p || {}).gzip = !0, u(o, p);
      };
    }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(d, k, m) {
      var i = d("./zlib/inflate"), s = d("./utils/common"), n = d("./utils/strings"), l = d("./zlib/constants"), g = d("./zlib/messages"), y = d("./zlib/zstream"), _ = d("./zlib/gzheader"), b = Object.prototype.toString;
      function a(r) {
        if (!(this instanceof a)) return new a(r);
        this.options = s.assign({ chunkSize: 16384, windowBits: 0, to: "" }, r || {});
        var u = this.options;
        u.raw && 0 <= u.windowBits && u.windowBits < 16 && (u.windowBits = -u.windowBits, u.windowBits === 0 && (u.windowBits = -15)), !(0 <= u.windowBits && u.windowBits < 16) || r && r.windowBits || (u.windowBits += 32), 15 < u.windowBits && u.windowBits < 48 && !(15 & u.windowBits) && (u.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new y(), this.strm.avail_out = 0;
        var o = i.inflateInit2(this.strm, u.windowBits);
        if (o !== l.Z_OK) throw new Error(g[o]);
        this.header = new _(), i.inflateGetHeader(this.strm, this.header);
      }
      function f(r, u) {
        var o = new a(u);
        if (o.push(r, !0), o.err) throw o.msg || g[o.err];
        return o.result;
      }
      a.prototype.push = function(r, u) {
        var o, p, w, S, E, D, N = this.strm, M = this.options.chunkSize, P = this.options.dictionary, q = !1;
        if (this.ended) return !1;
        p = u === ~~u ? u : u === !0 ? l.Z_FINISH : l.Z_NO_FLUSH, typeof r == "string" ? N.input = n.binstring2buf(r) : b.call(r) === "[object ArrayBuffer]" ? N.input = new Uint8Array(r) : N.input = r, N.next_in = 0, N.avail_in = N.input.length;
        do {
          if (N.avail_out === 0 && (N.output = new s.Buf8(M), N.next_out = 0, N.avail_out = M), (o = i.inflate(N, l.Z_NO_FLUSH)) === l.Z_NEED_DICT && P && (D = typeof P == "string" ? n.string2buf(P) : b.call(P) === "[object ArrayBuffer]" ? new Uint8Array(P) : P, o = i.inflateSetDictionary(this.strm, D)), o === l.Z_BUF_ERROR && q === !0 && (o = l.Z_OK, q = !1), o !== l.Z_STREAM_END && o !== l.Z_OK) return this.onEnd(o), !(this.ended = !0);
          N.next_out && (N.avail_out !== 0 && o !== l.Z_STREAM_END && (N.avail_in !== 0 || p !== l.Z_FINISH && p !== l.Z_SYNC_FLUSH) || (this.options.to === "string" ? (w = n.utf8border(N.output, N.next_out), S = N.next_out - w, E = n.buf2string(N.output, w), N.next_out = S, N.avail_out = M - S, S && s.arraySet(N.output, N.output, w, S, 0), this.onData(E)) : this.onData(s.shrinkBuf(N.output, N.next_out)))), N.avail_in === 0 && N.avail_out === 0 && (q = !0);
        } while ((0 < N.avail_in || N.avail_out === 0) && o !== l.Z_STREAM_END);
        return o === l.Z_STREAM_END && (p = l.Z_FINISH), p === l.Z_FINISH ? (o = i.inflateEnd(this.strm), this.onEnd(o), this.ended = !0, o === l.Z_OK) : p !== l.Z_SYNC_FLUSH || (this.onEnd(l.Z_OK), !(N.avail_out = 0));
      }, a.prototype.onData = function(r) {
        this.chunks.push(r);
      }, a.prototype.onEnd = function(r) {
        r === l.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = s.flattenChunks(this.chunks)), this.chunks = [], this.err = r, this.msg = this.strm.msg;
      }, m.Inflate = a, m.inflate = f, m.inflateRaw = function(r, u) {
        return (u = u || {}).raw = !0, f(r, u);
      }, m.ungzip = f;
    }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(d, k, m) {
      var i = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
      m.assign = function(l) {
        for (var g = Array.prototype.slice.call(arguments, 1); g.length; ) {
          var y = g.shift();
          if (y) {
            if (typeof y != "object") throw new TypeError(y + "must be non-object");
            for (var _ in y) y.hasOwnProperty(_) && (l[_] = y[_]);
          }
        }
        return l;
      }, m.shrinkBuf = function(l, g) {
        return l.length === g ? l : l.subarray ? l.subarray(0, g) : (l.length = g, l);
      };
      var s = { arraySet: function(l, g, y, _, b) {
        if (g.subarray && l.subarray) l.set(g.subarray(y, y + _), b);
        else for (var a = 0; a < _; a++) l[b + a] = g[y + a];
      }, flattenChunks: function(l) {
        var g, y, _, b, a, f;
        for (g = _ = 0, y = l.length; g < y; g++) _ += l[g].length;
        for (f = new Uint8Array(_), g = b = 0, y = l.length; g < y; g++) a = l[g], f.set(a, b), b += a.length;
        return f;
      } }, n = { arraySet: function(l, g, y, _, b) {
        for (var a = 0; a < _; a++) l[b + a] = g[y + a];
      }, flattenChunks: function(l) {
        return [].concat.apply([], l);
      } };
      m.setTyped = function(l) {
        l ? (m.Buf8 = Uint8Array, m.Buf16 = Uint16Array, m.Buf32 = Int32Array, m.assign(m, s)) : (m.Buf8 = Array, m.Buf16 = Array, m.Buf32 = Array, m.assign(m, n));
      }, m.setTyped(i);
    }, {}], 42: [function(d, k, m) {
      var i = d("./common"), s = !0, n = !0;
      try {
        String.fromCharCode.apply(null, [0]);
      } catch {
        s = !1;
      }
      try {
        String.fromCharCode.apply(null, new Uint8Array(1));
      } catch {
        n = !1;
      }
      for (var l = new i.Buf8(256), g = 0; g < 256; g++) l[g] = 252 <= g ? 6 : 248 <= g ? 5 : 240 <= g ? 4 : 224 <= g ? 3 : 192 <= g ? 2 : 1;
      function y(_, b) {
        if (b < 65537 && (_.subarray && n || !_.subarray && s)) return String.fromCharCode.apply(null, i.shrinkBuf(_, b));
        for (var a = "", f = 0; f < b; f++) a += String.fromCharCode(_[f]);
        return a;
      }
      l[254] = l[254] = 1, m.string2buf = function(_) {
        var b, a, f, r, u, o = _.length, p = 0;
        for (r = 0; r < o; r++) (64512 & (a = _.charCodeAt(r))) == 55296 && r + 1 < o && (64512 & (f = _.charCodeAt(r + 1))) == 56320 && (a = 65536 + (a - 55296 << 10) + (f - 56320), r++), p += a < 128 ? 1 : a < 2048 ? 2 : a < 65536 ? 3 : 4;
        for (b = new i.Buf8(p), r = u = 0; u < p; r++) (64512 & (a = _.charCodeAt(r))) == 55296 && r + 1 < o && (64512 & (f = _.charCodeAt(r + 1))) == 56320 && (a = 65536 + (a - 55296 << 10) + (f - 56320), r++), a < 128 ? b[u++] = a : (a < 2048 ? b[u++] = 192 | a >>> 6 : (a < 65536 ? b[u++] = 224 | a >>> 12 : (b[u++] = 240 | a >>> 18, b[u++] = 128 | a >>> 12 & 63), b[u++] = 128 | a >>> 6 & 63), b[u++] = 128 | 63 & a);
        return b;
      }, m.buf2binstring = function(_) {
        return y(_, _.length);
      }, m.binstring2buf = function(_) {
        for (var b = new i.Buf8(_.length), a = 0, f = b.length; a < f; a++) b[a] = _.charCodeAt(a);
        return b;
      }, m.buf2string = function(_, b) {
        var a, f, r, u, o = b || _.length, p = new Array(2 * o);
        for (a = f = 0; a < o; ) if ((r = _[a++]) < 128) p[f++] = r;
        else if (4 < (u = l[r])) p[f++] = 65533, a += u - 1;
        else {
          for (r &= u === 2 ? 31 : u === 3 ? 15 : 7; 1 < u && a < o; ) r = r << 6 | 63 & _[a++], u--;
          1 < u ? p[f++] = 65533 : r < 65536 ? p[f++] = r : (r -= 65536, p[f++] = 55296 | r >> 10 & 1023, p[f++] = 56320 | 1023 & r);
        }
        return y(p, f);
      }, m.utf8border = function(_, b) {
        var a;
        for ((b = b || _.length) > _.length && (b = _.length), a = b - 1; 0 <= a && (192 & _[a]) == 128; ) a--;
        return a < 0 || a === 0 ? b : a + l[_[a]] > b ? a : b;
      };
    }, { "./common": 41 }], 43: [function(d, k, m) {
      k.exports = function(i, s, n, l) {
        for (var g = 65535 & i | 0, y = i >>> 16 & 65535 | 0, _ = 0; n !== 0; ) {
          for (n -= _ = 2e3 < n ? 2e3 : n; y = y + (g = g + s[l++] | 0) | 0, --_; ) ;
          g %= 65521, y %= 65521;
        }
        return g | y << 16 | 0;
      };
    }, {}], 44: [function(d, k, m) {
      k.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
    }, {}], 45: [function(d, k, m) {
      var i = function() {
        for (var s, n = [], l = 0; l < 256; l++) {
          s = l;
          for (var g = 0; g < 8; g++) s = 1 & s ? 3988292384 ^ s >>> 1 : s >>> 1;
          n[l] = s;
        }
        return n;
      }();
      k.exports = function(s, n, l, g) {
        var y = i, _ = g + l;
        s ^= -1;
        for (var b = g; b < _; b++) s = s >>> 8 ^ y[255 & (s ^ n[b])];
        return -1 ^ s;
      };
    }, {}], 46: [function(d, k, m) {
      var i, s = d("../utils/common"), n = d("./trees"), l = d("./adler32"), g = d("./crc32"), y = d("./messages"), _ = 0, b = 4, a = 0, f = -2, r = -1, u = 4, o = 2, p = 8, w = 9, S = 286, E = 30, D = 19, N = 2 * S + 1, M = 15, P = 3, q = 258, X = q + P + 1, v = 42, z = 113, e = 1, F = 2, Q = 3, L = 4;
      function tt(t, T) {
        return t.msg = y[T], T;
      }
      function W(t) {
        return (t << 1) - (4 < t ? 9 : 0);
      }
      function J(t) {
        for (var T = t.length; 0 <= --T; ) t[T] = 0;
      }
      function A(t) {
        var T = t.state, C = T.pending;
        C > t.avail_out && (C = t.avail_out), C !== 0 && (s.arraySet(t.output, T.pending_buf, T.pending_out, C, t.next_out), t.next_out += C, T.pending_out += C, t.total_out += C, t.avail_out -= C, T.pending -= C, T.pending === 0 && (T.pending_out = 0));
      }
      function B(t, T) {
        n._tr_flush_block(t, 0 <= t.block_start ? t.block_start : -1, t.strstart - t.block_start, T), t.block_start = t.strstart, A(t.strm);
      }
      function K(t, T) {
        t.pending_buf[t.pending++] = T;
      }
      function G(t, T) {
        t.pending_buf[t.pending++] = T >>> 8 & 255, t.pending_buf[t.pending++] = 255 & T;
      }
      function $(t, T) {
        var C, h, c = t.max_chain_length, x = t.strstart, R = t.prev_length, U = t.nice_match, I = t.strstart > t.w_size - X ? t.strstart - (t.w_size - X) : 0, Z = t.window, V = t.w_mask, H = t.prev, Y = t.strstart + q, it = Z[x + R - 1], nt = Z[x + R];
        t.prev_length >= t.good_match && (c >>= 2), U > t.lookahead && (U = t.lookahead);
        do
          if (Z[(C = T) + R] === nt && Z[C + R - 1] === it && Z[C] === Z[x] && Z[++C] === Z[x + 1]) {
            x += 2, C++;
            do
              ;
            while (Z[++x] === Z[++C] && Z[++x] === Z[++C] && Z[++x] === Z[++C] && Z[++x] === Z[++C] && Z[++x] === Z[++C] && Z[++x] === Z[++C] && Z[++x] === Z[++C] && Z[++x] === Z[++C] && x < Y);
            if (h = q - (Y - x), x = Y - q, R < h) {
              if (t.match_start = T, U <= (R = h)) break;
              it = Z[x + R - 1], nt = Z[x + R];
            }
          }
        while ((T = H[T & V]) > I && --c != 0);
        return R <= t.lookahead ? R : t.lookahead;
      }
      function at(t) {
        var T, C, h, c, x, R, U, I, Z, V, H = t.w_size;
        do {
          if (c = t.window_size - t.lookahead - t.strstart, t.strstart >= H + (H - X)) {
            for (s.arraySet(t.window, t.window, H, H, 0), t.match_start -= H, t.strstart -= H, t.block_start -= H, T = C = t.hash_size; h = t.head[--T], t.head[T] = H <= h ? h - H : 0, --C; ) ;
            for (T = C = H; h = t.prev[--T], t.prev[T] = H <= h ? h - H : 0, --C; ) ;
            c += H;
          }
          if (t.strm.avail_in === 0) break;
          if (R = t.strm, U = t.window, I = t.strstart + t.lookahead, Z = c, V = void 0, V = R.avail_in, Z < V && (V = Z), C = V === 0 ? 0 : (R.avail_in -= V, s.arraySet(U, R.input, R.next_in, V, I), R.state.wrap === 1 ? R.adler = l(R.adler, U, V, I) : R.state.wrap === 2 && (R.adler = g(R.adler, U, V, I)), R.next_in += V, R.total_in += V, V), t.lookahead += C, t.lookahead + t.insert >= P) for (x = t.strstart - t.insert, t.ins_h = t.window[x], t.ins_h = (t.ins_h << t.hash_shift ^ t.window[x + 1]) & t.hash_mask; t.insert && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[x + P - 1]) & t.hash_mask, t.prev[x & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = x, x++, t.insert--, !(t.lookahead + t.insert < P)); ) ;
        } while (t.lookahead < X && t.strm.avail_in !== 0);
      }
      function ct(t, T) {
        for (var C, h; ; ) {
          if (t.lookahead < X) {
            if (at(t), t.lookahead < X && T === _) return e;
            if (t.lookahead === 0) break;
          }
          if (C = 0, t.lookahead >= P && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + P - 1]) & t.hash_mask, C = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), C !== 0 && t.strstart - C <= t.w_size - X && (t.match_length = $(t, C)), t.match_length >= P) if (h = n._tr_tally(t, t.strstart - t.match_start, t.match_length - P), t.lookahead -= t.match_length, t.match_length <= t.max_lazy_match && t.lookahead >= P) {
            for (t.match_length--; t.strstart++, t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + P - 1]) & t.hash_mask, C = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart, --t.match_length != 0; ) ;
            t.strstart++;
          } else t.strstart += t.match_length, t.match_length = 0, t.ins_h = t.window[t.strstart], t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + 1]) & t.hash_mask;
          else h = n._tr_tally(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++;
          if (h && (B(t, !1), t.strm.avail_out === 0)) return e;
        }
        return t.insert = t.strstart < P - 1 ? t.strstart : P - 1, T === b ? (B(t, !0), t.strm.avail_out === 0 ? Q : L) : t.last_lit && (B(t, !1), t.strm.avail_out === 0) ? e : F;
      }
      function et(t, T) {
        for (var C, h, c; ; ) {
          if (t.lookahead < X) {
            if (at(t), t.lookahead < X && T === _) return e;
            if (t.lookahead === 0) break;
          }
          if (C = 0, t.lookahead >= P && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + P - 1]) & t.hash_mask, C = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), t.prev_length = t.match_length, t.prev_match = t.match_start, t.match_length = P - 1, C !== 0 && t.prev_length < t.max_lazy_match && t.strstart - C <= t.w_size - X && (t.match_length = $(t, C), t.match_length <= 5 && (t.strategy === 1 || t.match_length === P && 4096 < t.strstart - t.match_start) && (t.match_length = P - 1)), t.prev_length >= P && t.match_length <= t.prev_length) {
            for (c = t.strstart + t.lookahead - P, h = n._tr_tally(t, t.strstart - 1 - t.prev_match, t.prev_length - P), t.lookahead -= t.prev_length - 1, t.prev_length -= 2; ++t.strstart <= c && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + P - 1]) & t.hash_mask, C = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), --t.prev_length != 0; ) ;
            if (t.match_available = 0, t.match_length = P - 1, t.strstart++, h && (B(t, !1), t.strm.avail_out === 0)) return e;
          } else if (t.match_available) {
            if ((h = n._tr_tally(t, 0, t.window[t.strstart - 1])) && B(t, !1), t.strstart++, t.lookahead--, t.strm.avail_out === 0) return e;
          } else t.match_available = 1, t.strstart++, t.lookahead--;
        }
        return t.match_available && (h = n._tr_tally(t, 0, t.window[t.strstart - 1]), t.match_available = 0), t.insert = t.strstart < P - 1 ? t.strstart : P - 1, T === b ? (B(t, !0), t.strm.avail_out === 0 ? Q : L) : t.last_lit && (B(t, !1), t.strm.avail_out === 0) ? e : F;
      }
      function rt(t, T, C, h, c) {
        this.good_length = t, this.max_lazy = T, this.nice_length = C, this.max_chain = h, this.func = c;
      }
      function dt() {
        this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = p, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new s.Buf16(2 * N), this.dyn_dtree = new s.Buf16(2 * (2 * E + 1)), this.bl_tree = new s.Buf16(2 * (2 * D + 1)), J(this.dyn_ltree), J(this.dyn_dtree), J(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new s.Buf16(M + 1), this.heap = new s.Buf16(2 * S + 1), J(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new s.Buf16(2 * S + 1), J(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
      }
      function st(t) {
        var T;
        return t && t.state ? (t.total_in = t.total_out = 0, t.data_type = o, (T = t.state).pending = 0, T.pending_out = 0, T.wrap < 0 && (T.wrap = -T.wrap), T.status = T.wrap ? v : z, t.adler = T.wrap === 2 ? 0 : 1, T.last_flush = _, n._tr_init(T), a) : tt(t, f);
      }
      function pt(t) {
        var T = st(t);
        return T === a && function(C) {
          C.window_size = 2 * C.w_size, J(C.head), C.max_lazy_match = i[C.level].max_lazy, C.good_match = i[C.level].good_length, C.nice_match = i[C.level].nice_length, C.max_chain_length = i[C.level].max_chain, C.strstart = 0, C.block_start = 0, C.lookahead = 0, C.insert = 0, C.match_length = C.prev_length = P - 1, C.match_available = 0, C.ins_h = 0;
        }(t.state), T;
      }
      function ft(t, T, C, h, c, x) {
        if (!t) return f;
        var R = 1;
        if (T === r && (T = 6), h < 0 ? (R = 0, h = -h) : 15 < h && (R = 2, h -= 16), c < 1 || w < c || C !== p || h < 8 || 15 < h || T < 0 || 9 < T || x < 0 || u < x) return tt(t, f);
        h === 8 && (h = 9);
        var U = new dt();
        return (t.state = U).strm = t, U.wrap = R, U.gzhead = null, U.w_bits = h, U.w_size = 1 << U.w_bits, U.w_mask = U.w_size - 1, U.hash_bits = c + 7, U.hash_size = 1 << U.hash_bits, U.hash_mask = U.hash_size - 1, U.hash_shift = ~~((U.hash_bits + P - 1) / P), U.window = new s.Buf8(2 * U.w_size), U.head = new s.Buf16(U.hash_size), U.prev = new s.Buf16(U.w_size), U.lit_bufsize = 1 << c + 6, U.pending_buf_size = 4 * U.lit_bufsize, U.pending_buf = new s.Buf8(U.pending_buf_size), U.d_buf = 1 * U.lit_bufsize, U.l_buf = 3 * U.lit_bufsize, U.level = T, U.strategy = x, U.method = C, pt(t);
      }
      i = [new rt(0, 0, 0, 0, function(t, T) {
        var C = 65535;
        for (C > t.pending_buf_size - 5 && (C = t.pending_buf_size - 5); ; ) {
          if (t.lookahead <= 1) {
            if (at(t), t.lookahead === 0 && T === _) return e;
            if (t.lookahead === 0) break;
          }
          t.strstart += t.lookahead, t.lookahead = 0;
          var h = t.block_start + C;
          if ((t.strstart === 0 || t.strstart >= h) && (t.lookahead = t.strstart - h, t.strstart = h, B(t, !1), t.strm.avail_out === 0) || t.strstart - t.block_start >= t.w_size - X && (B(t, !1), t.strm.avail_out === 0)) return e;
        }
        return t.insert = 0, T === b ? (B(t, !0), t.strm.avail_out === 0 ? Q : L) : (t.strstart > t.block_start && (B(t, !1), t.strm.avail_out), e);
      }), new rt(4, 4, 8, 4, ct), new rt(4, 5, 16, 8, ct), new rt(4, 6, 32, 32, ct), new rt(4, 4, 16, 16, et), new rt(8, 16, 32, 32, et), new rt(8, 16, 128, 128, et), new rt(8, 32, 128, 256, et), new rt(32, 128, 258, 1024, et), new rt(32, 258, 258, 4096, et)], m.deflateInit = function(t, T) {
        return ft(t, T, p, 15, 8, 0);
      }, m.deflateInit2 = ft, m.deflateReset = pt, m.deflateResetKeep = st, m.deflateSetHeader = function(t, T) {
        return t && t.state ? t.state.wrap !== 2 ? f : (t.state.gzhead = T, a) : f;
      }, m.deflate = function(t, T) {
        var C, h, c, x;
        if (!t || !t.state || 5 < T || T < 0) return t ? tt(t, f) : f;
        if (h = t.state, !t.output || !t.input && t.avail_in !== 0 || h.status === 666 && T !== b) return tt(t, t.avail_out === 0 ? -5 : f);
        if (h.strm = t, C = h.last_flush, h.last_flush = T, h.status === v) if (h.wrap === 2) t.adler = 0, K(h, 31), K(h, 139), K(h, 8), h.gzhead ? (K(h, (h.gzhead.text ? 1 : 0) + (h.gzhead.hcrc ? 2 : 0) + (h.gzhead.extra ? 4 : 0) + (h.gzhead.name ? 8 : 0) + (h.gzhead.comment ? 16 : 0)), K(h, 255 & h.gzhead.time), K(h, h.gzhead.time >> 8 & 255), K(h, h.gzhead.time >> 16 & 255), K(h, h.gzhead.time >> 24 & 255), K(h, h.level === 9 ? 2 : 2 <= h.strategy || h.level < 2 ? 4 : 0), K(h, 255 & h.gzhead.os), h.gzhead.extra && h.gzhead.extra.length && (K(h, 255 & h.gzhead.extra.length), K(h, h.gzhead.extra.length >> 8 & 255)), h.gzhead.hcrc && (t.adler = g(t.adler, h.pending_buf, h.pending, 0)), h.gzindex = 0, h.status = 69) : (K(h, 0), K(h, 0), K(h, 0), K(h, 0), K(h, 0), K(h, h.level === 9 ? 2 : 2 <= h.strategy || h.level < 2 ? 4 : 0), K(h, 3), h.status = z);
        else {
          var R = p + (h.w_bits - 8 << 4) << 8;
          R |= (2 <= h.strategy || h.level < 2 ? 0 : h.level < 6 ? 1 : h.level === 6 ? 2 : 3) << 6, h.strstart !== 0 && (R |= 32), R += 31 - R % 31, h.status = z, G(h, R), h.strstart !== 0 && (G(h, t.adler >>> 16), G(h, 65535 & t.adler)), t.adler = 1;
        }
        if (h.status === 69) if (h.gzhead.extra) {
          for (c = h.pending; h.gzindex < (65535 & h.gzhead.extra.length) && (h.pending !== h.pending_buf_size || (h.gzhead.hcrc && h.pending > c && (t.adler = g(t.adler, h.pending_buf, h.pending - c, c)), A(t), c = h.pending, h.pending !== h.pending_buf_size)); ) K(h, 255 & h.gzhead.extra[h.gzindex]), h.gzindex++;
          h.gzhead.hcrc && h.pending > c && (t.adler = g(t.adler, h.pending_buf, h.pending - c, c)), h.gzindex === h.gzhead.extra.length && (h.gzindex = 0, h.status = 73);
        } else h.status = 73;
        if (h.status === 73) if (h.gzhead.name) {
          c = h.pending;
          do {
            if (h.pending === h.pending_buf_size && (h.gzhead.hcrc && h.pending > c && (t.adler = g(t.adler, h.pending_buf, h.pending - c, c)), A(t), c = h.pending, h.pending === h.pending_buf_size)) {
              x = 1;
              break;
            }
            x = h.gzindex < h.gzhead.name.length ? 255 & h.gzhead.name.charCodeAt(h.gzindex++) : 0, K(h, x);
          } while (x !== 0);
          h.gzhead.hcrc && h.pending > c && (t.adler = g(t.adler, h.pending_buf, h.pending - c, c)), x === 0 && (h.gzindex = 0, h.status = 91);
        } else h.status = 91;
        if (h.status === 91) if (h.gzhead.comment) {
          c = h.pending;
          do {
            if (h.pending === h.pending_buf_size && (h.gzhead.hcrc && h.pending > c && (t.adler = g(t.adler, h.pending_buf, h.pending - c, c)), A(t), c = h.pending, h.pending === h.pending_buf_size)) {
              x = 1;
              break;
            }
            x = h.gzindex < h.gzhead.comment.length ? 255 & h.gzhead.comment.charCodeAt(h.gzindex++) : 0, K(h, x);
          } while (x !== 0);
          h.gzhead.hcrc && h.pending > c && (t.adler = g(t.adler, h.pending_buf, h.pending - c, c)), x === 0 && (h.status = 103);
        } else h.status = 103;
        if (h.status === 103 && (h.gzhead.hcrc ? (h.pending + 2 > h.pending_buf_size && A(t), h.pending + 2 <= h.pending_buf_size && (K(h, 255 & t.adler), K(h, t.adler >> 8 & 255), t.adler = 0, h.status = z)) : h.status = z), h.pending !== 0) {
          if (A(t), t.avail_out === 0) return h.last_flush = -1, a;
        } else if (t.avail_in === 0 && W(T) <= W(C) && T !== b) return tt(t, -5);
        if (h.status === 666 && t.avail_in !== 0) return tt(t, -5);
        if (t.avail_in !== 0 || h.lookahead !== 0 || T !== _ && h.status !== 666) {
          var U = h.strategy === 2 ? function(I, Z) {
            for (var V; ; ) {
              if (I.lookahead === 0 && (at(I), I.lookahead === 0)) {
                if (Z === _) return e;
                break;
              }
              if (I.match_length = 0, V = n._tr_tally(I, 0, I.window[I.strstart]), I.lookahead--, I.strstart++, V && (B(I, !1), I.strm.avail_out === 0)) return e;
            }
            return I.insert = 0, Z === b ? (B(I, !0), I.strm.avail_out === 0 ? Q : L) : I.last_lit && (B(I, !1), I.strm.avail_out === 0) ? e : F;
          }(h, T) : h.strategy === 3 ? function(I, Z) {
            for (var V, H, Y, it, nt = I.window; ; ) {
              if (I.lookahead <= q) {
                if (at(I), I.lookahead <= q && Z === _) return e;
                if (I.lookahead === 0) break;
              }
              if (I.match_length = 0, I.lookahead >= P && 0 < I.strstart && (H = nt[Y = I.strstart - 1]) === nt[++Y] && H === nt[++Y] && H === nt[++Y]) {
                it = I.strstart + q;
                do
                  ;
                while (H === nt[++Y] && H === nt[++Y] && H === nt[++Y] && H === nt[++Y] && H === nt[++Y] && H === nt[++Y] && H === nt[++Y] && H === nt[++Y] && Y < it);
                I.match_length = q - (it - Y), I.match_length > I.lookahead && (I.match_length = I.lookahead);
              }
              if (I.match_length >= P ? (V = n._tr_tally(I, 1, I.match_length - P), I.lookahead -= I.match_length, I.strstart += I.match_length, I.match_length = 0) : (V = n._tr_tally(I, 0, I.window[I.strstart]), I.lookahead--, I.strstart++), V && (B(I, !1), I.strm.avail_out === 0)) return e;
            }
            return I.insert = 0, Z === b ? (B(I, !0), I.strm.avail_out === 0 ? Q : L) : I.last_lit && (B(I, !1), I.strm.avail_out === 0) ? e : F;
          }(h, T) : i[h.level].func(h, T);
          if (U !== Q && U !== L || (h.status = 666), U === e || U === Q) return t.avail_out === 0 && (h.last_flush = -1), a;
          if (U === F && (T === 1 ? n._tr_align(h) : T !== 5 && (n._tr_stored_block(h, 0, 0, !1), T === 3 && (J(h.head), h.lookahead === 0 && (h.strstart = 0, h.block_start = 0, h.insert = 0))), A(t), t.avail_out === 0)) return h.last_flush = -1, a;
        }
        return T !== b ? a : h.wrap <= 0 ? 1 : (h.wrap === 2 ? (K(h, 255 & t.adler), K(h, t.adler >> 8 & 255), K(h, t.adler >> 16 & 255), K(h, t.adler >> 24 & 255), K(h, 255 & t.total_in), K(h, t.total_in >> 8 & 255), K(h, t.total_in >> 16 & 255), K(h, t.total_in >> 24 & 255)) : (G(h, t.adler >>> 16), G(h, 65535 & t.adler)), A(t), 0 < h.wrap && (h.wrap = -h.wrap), h.pending !== 0 ? a : 1);
      }, m.deflateEnd = function(t) {
        var T;
        return t && t.state ? (T = t.state.status) !== v && T !== 69 && T !== 73 && T !== 91 && T !== 103 && T !== z && T !== 666 ? tt(t, f) : (t.state = null, T === z ? tt(t, -3) : a) : f;
      }, m.deflateSetDictionary = function(t, T) {
        var C, h, c, x, R, U, I, Z, V = T.length;
        if (!t || !t.state || (x = (C = t.state).wrap) === 2 || x === 1 && C.status !== v || C.lookahead) return f;
        for (x === 1 && (t.adler = l(t.adler, T, V, 0)), C.wrap = 0, V >= C.w_size && (x === 0 && (J(C.head), C.strstart = 0, C.block_start = 0, C.insert = 0), Z = new s.Buf8(C.w_size), s.arraySet(Z, T, V - C.w_size, C.w_size, 0), T = Z, V = C.w_size), R = t.avail_in, U = t.next_in, I = t.input, t.avail_in = V, t.next_in = 0, t.input = T, at(C); C.lookahead >= P; ) {
          for (h = C.strstart, c = C.lookahead - (P - 1); C.ins_h = (C.ins_h << C.hash_shift ^ C.window[h + P - 1]) & C.hash_mask, C.prev[h & C.w_mask] = C.head[C.ins_h], C.head[C.ins_h] = h, h++, --c; ) ;
          C.strstart = h, C.lookahead = P - 1, at(C);
        }
        return C.strstart += C.lookahead, C.block_start = C.strstart, C.insert = C.lookahead, C.lookahead = 0, C.match_length = C.prev_length = P - 1, C.match_available = 0, t.next_in = U, t.input = I, t.avail_in = R, C.wrap = x, a;
      }, m.deflateInfo = "pako deflate (from Nodeca project)";
    }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(d, k, m) {
      k.exports = function() {
        this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
      };
    }, {}], 48: [function(d, k, m) {
      k.exports = function(i, s) {
        var n, l, g, y, _, b, a, f, r, u, o, p, w, S, E, D, N, M, P, q, X, v, z, e, F;
        n = i.state, l = i.next_in, e = i.input, g = l + (i.avail_in - 5), y = i.next_out, F = i.output, _ = y - (s - i.avail_out), b = y + (i.avail_out - 257), a = n.dmax, f = n.wsize, r = n.whave, u = n.wnext, o = n.window, p = n.hold, w = n.bits, S = n.lencode, E = n.distcode, D = (1 << n.lenbits) - 1, N = (1 << n.distbits) - 1;
        t: do {
          w < 15 && (p += e[l++] << w, w += 8, p += e[l++] << w, w += 8), M = S[p & D];
          e: for (; ; ) {
            if (p >>>= P = M >>> 24, w -= P, (P = M >>> 16 & 255) === 0) F[y++] = 65535 & M;
            else {
              if (!(16 & P)) {
                if (!(64 & P)) {
                  M = S[(65535 & M) + (p & (1 << P) - 1)];
                  continue e;
                }
                if (32 & P) {
                  n.mode = 12;
                  break t;
                }
                i.msg = "invalid literal/length code", n.mode = 30;
                break t;
              }
              q = 65535 & M, (P &= 15) && (w < P && (p += e[l++] << w, w += 8), q += p & (1 << P) - 1, p >>>= P, w -= P), w < 15 && (p += e[l++] << w, w += 8, p += e[l++] << w, w += 8), M = E[p & N];
              n: for (; ; ) {
                if (p >>>= P = M >>> 24, w -= P, !(16 & (P = M >>> 16 & 255))) {
                  if (!(64 & P)) {
                    M = E[(65535 & M) + (p & (1 << P) - 1)];
                    continue n;
                  }
                  i.msg = "invalid distance code", n.mode = 30;
                  break t;
                }
                if (X = 65535 & M, w < (P &= 15) && (p += e[l++] << w, (w += 8) < P && (p += e[l++] << w, w += 8)), a < (X += p & (1 << P) - 1)) {
                  i.msg = "invalid distance too far back", n.mode = 30;
                  break t;
                }
                if (p >>>= P, w -= P, (P = y - _) < X) {
                  if (r < (P = X - P) && n.sane) {
                    i.msg = "invalid distance too far back", n.mode = 30;
                    break t;
                  }
                  if (z = o, (v = 0) === u) {
                    if (v += f - P, P < q) {
                      for (q -= P; F[y++] = o[v++], --P; ) ;
                      v = y - X, z = F;
                    }
                  } else if (u < P) {
                    if (v += f + u - P, (P -= u) < q) {
                      for (q -= P; F[y++] = o[v++], --P; ) ;
                      if (v = 0, u < q) {
                        for (q -= P = u; F[y++] = o[v++], --P; ) ;
                        v = y - X, z = F;
                      }
                    }
                  } else if (v += u - P, P < q) {
                    for (q -= P; F[y++] = o[v++], --P; ) ;
                    v = y - X, z = F;
                  }
                  for (; 2 < q; ) F[y++] = z[v++], F[y++] = z[v++], F[y++] = z[v++], q -= 3;
                  q && (F[y++] = z[v++], 1 < q && (F[y++] = z[v++]));
                } else {
                  for (v = y - X; F[y++] = F[v++], F[y++] = F[v++], F[y++] = F[v++], 2 < (q -= 3); ) ;
                  q && (F[y++] = F[v++], 1 < q && (F[y++] = F[v++]));
                }
                break;
              }
            }
            break;
          }
        } while (l < g && y < b);
        l -= q = w >> 3, p &= (1 << (w -= q << 3)) - 1, i.next_in = l, i.next_out = y, i.avail_in = l < g ? g - l + 5 : 5 - (l - g), i.avail_out = y < b ? b - y + 257 : 257 - (y - b), n.hold = p, n.bits = w;
      };
    }, {}], 49: [function(d, k, m) {
      var i = d("../utils/common"), s = d("./adler32"), n = d("./crc32"), l = d("./inffast"), g = d("./inftrees"), y = 1, _ = 2, b = 0, a = -2, f = 1, r = 852, u = 592;
      function o(v) {
        return (v >>> 24 & 255) + (v >>> 8 & 65280) + ((65280 & v) << 8) + ((255 & v) << 24);
      }
      function p() {
        this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new i.Buf16(320), this.work = new i.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
      }
      function w(v) {
        var z;
        return v && v.state ? (z = v.state, v.total_in = v.total_out = z.total = 0, v.msg = "", z.wrap && (v.adler = 1 & z.wrap), z.mode = f, z.last = 0, z.havedict = 0, z.dmax = 32768, z.head = null, z.hold = 0, z.bits = 0, z.lencode = z.lendyn = new i.Buf32(r), z.distcode = z.distdyn = new i.Buf32(u), z.sane = 1, z.back = -1, b) : a;
      }
      function S(v) {
        var z;
        return v && v.state ? ((z = v.state).wsize = 0, z.whave = 0, z.wnext = 0, w(v)) : a;
      }
      function E(v, z) {
        var e, F;
        return v && v.state ? (F = v.state, z < 0 ? (e = 0, z = -z) : (e = 1 + (z >> 4), z < 48 && (z &= 15)), z && (z < 8 || 15 < z) ? a : (F.window !== null && F.wbits !== z && (F.window = null), F.wrap = e, F.wbits = z, S(v))) : a;
      }
      function D(v, z) {
        var e, F;
        return v ? (F = new p(), (v.state = F).window = null, (e = E(v, z)) !== b && (v.state = null), e) : a;
      }
      var N, M, P = !0;
      function q(v) {
        if (P) {
          var z;
          for (N = new i.Buf32(512), M = new i.Buf32(32), z = 0; z < 144; ) v.lens[z++] = 8;
          for (; z < 256; ) v.lens[z++] = 9;
          for (; z < 280; ) v.lens[z++] = 7;
          for (; z < 288; ) v.lens[z++] = 8;
          for (g(y, v.lens, 0, 288, N, 0, v.work, { bits: 9 }), z = 0; z < 32; ) v.lens[z++] = 5;
          g(_, v.lens, 0, 32, M, 0, v.work, { bits: 5 }), P = !1;
        }
        v.lencode = N, v.lenbits = 9, v.distcode = M, v.distbits = 5;
      }
      function X(v, z, e, F) {
        var Q, L = v.state;
        return L.window === null && (L.wsize = 1 << L.wbits, L.wnext = 0, L.whave = 0, L.window = new i.Buf8(L.wsize)), F >= L.wsize ? (i.arraySet(L.window, z, e - L.wsize, L.wsize, 0), L.wnext = 0, L.whave = L.wsize) : (F < (Q = L.wsize - L.wnext) && (Q = F), i.arraySet(L.window, z, e - F, Q, L.wnext), (F -= Q) ? (i.arraySet(L.window, z, e - F, F, 0), L.wnext = F, L.whave = L.wsize) : (L.wnext += Q, L.wnext === L.wsize && (L.wnext = 0), L.whave < L.wsize && (L.whave += Q))), 0;
      }
      m.inflateReset = S, m.inflateReset2 = E, m.inflateResetKeep = w, m.inflateInit = function(v) {
        return D(v, 15);
      }, m.inflateInit2 = D, m.inflate = function(v, z) {
        var e, F, Q, L, tt, W, J, A, B, K, G, $, at, ct, et, rt, dt, st, pt, ft, t, T, C, h, c = 0, x = new i.Buf8(4), R = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
        if (!v || !v.state || !v.output || !v.input && v.avail_in !== 0) return a;
        (e = v.state).mode === 12 && (e.mode = 13), tt = v.next_out, Q = v.output, J = v.avail_out, L = v.next_in, F = v.input, W = v.avail_in, A = e.hold, B = e.bits, K = W, G = J, T = b;
        t: for (; ; ) switch (e.mode) {
          case f:
            if (e.wrap === 0) {
              e.mode = 13;
              break;
            }
            for (; B < 16; ) {
              if (W === 0) break t;
              W--, A += F[L++] << B, B += 8;
            }
            if (2 & e.wrap && A === 35615) {
              x[e.check = 0] = 255 & A, x[1] = A >>> 8 & 255, e.check = n(e.check, x, 2, 0), B = A = 0, e.mode = 2;
              break;
            }
            if (e.flags = 0, e.head && (e.head.done = !1), !(1 & e.wrap) || (((255 & A) << 8) + (A >> 8)) % 31) {
              v.msg = "incorrect header check", e.mode = 30;
              break;
            }
            if ((15 & A) != 8) {
              v.msg = "unknown compression method", e.mode = 30;
              break;
            }
            if (B -= 4, t = 8 + (15 & (A >>>= 4)), e.wbits === 0) e.wbits = t;
            else if (t > e.wbits) {
              v.msg = "invalid window size", e.mode = 30;
              break;
            }
            e.dmax = 1 << t, v.adler = e.check = 1, e.mode = 512 & A ? 10 : 12, B = A = 0;
            break;
          case 2:
            for (; B < 16; ) {
              if (W === 0) break t;
              W--, A += F[L++] << B, B += 8;
            }
            if (e.flags = A, (255 & e.flags) != 8) {
              v.msg = "unknown compression method", e.mode = 30;
              break;
            }
            if (57344 & e.flags) {
              v.msg = "unknown header flags set", e.mode = 30;
              break;
            }
            e.head && (e.head.text = A >> 8 & 1), 512 & e.flags && (x[0] = 255 & A, x[1] = A >>> 8 & 255, e.check = n(e.check, x, 2, 0)), B = A = 0, e.mode = 3;
          case 3:
            for (; B < 32; ) {
              if (W === 0) break t;
              W--, A += F[L++] << B, B += 8;
            }
            e.head && (e.head.time = A), 512 & e.flags && (x[0] = 255 & A, x[1] = A >>> 8 & 255, x[2] = A >>> 16 & 255, x[3] = A >>> 24 & 255, e.check = n(e.check, x, 4, 0)), B = A = 0, e.mode = 4;
          case 4:
            for (; B < 16; ) {
              if (W === 0) break t;
              W--, A += F[L++] << B, B += 8;
            }
            e.head && (e.head.xflags = 255 & A, e.head.os = A >> 8), 512 & e.flags && (x[0] = 255 & A, x[1] = A >>> 8 & 255, e.check = n(e.check, x, 2, 0)), B = A = 0, e.mode = 5;
          case 5:
            if (1024 & e.flags) {
              for (; B < 16; ) {
                if (W === 0) break t;
                W--, A += F[L++] << B, B += 8;
              }
              e.length = A, e.head && (e.head.extra_len = A), 512 & e.flags && (x[0] = 255 & A, x[1] = A >>> 8 & 255, e.check = n(e.check, x, 2, 0)), B = A = 0;
            } else e.head && (e.head.extra = null);
            e.mode = 6;
          case 6:
            if (1024 & e.flags && (W < ($ = e.length) && ($ = W), $ && (e.head && (t = e.head.extra_len - e.length, e.head.extra || (e.head.extra = new Array(e.head.extra_len)), i.arraySet(e.head.extra, F, L, $, t)), 512 & e.flags && (e.check = n(e.check, F, $, L)), W -= $, L += $, e.length -= $), e.length)) break t;
            e.length = 0, e.mode = 7;
          case 7:
            if (2048 & e.flags) {
              if (W === 0) break t;
              for ($ = 0; t = F[L + $++], e.head && t && e.length < 65536 && (e.head.name += String.fromCharCode(t)), t && $ < W; ) ;
              if (512 & e.flags && (e.check = n(e.check, F, $, L)), W -= $, L += $, t) break t;
            } else e.head && (e.head.name = null);
            e.length = 0, e.mode = 8;
          case 8:
            if (4096 & e.flags) {
              if (W === 0) break t;
              for ($ = 0; t = F[L + $++], e.head && t && e.length < 65536 && (e.head.comment += String.fromCharCode(t)), t && $ < W; ) ;
              if (512 & e.flags && (e.check = n(e.check, F, $, L)), W -= $, L += $, t) break t;
            } else e.head && (e.head.comment = null);
            e.mode = 9;
          case 9:
            if (512 & e.flags) {
              for (; B < 16; ) {
                if (W === 0) break t;
                W--, A += F[L++] << B, B += 8;
              }
              if (A !== (65535 & e.check)) {
                v.msg = "header crc mismatch", e.mode = 30;
                break;
              }
              B = A = 0;
            }
            e.head && (e.head.hcrc = e.flags >> 9 & 1, e.head.done = !0), v.adler = e.check = 0, e.mode = 12;
            break;
          case 10:
            for (; B < 32; ) {
              if (W === 0) break t;
              W--, A += F[L++] << B, B += 8;
            }
            v.adler = e.check = o(A), B = A = 0, e.mode = 11;
          case 11:
            if (e.havedict === 0) return v.next_out = tt, v.avail_out = J, v.next_in = L, v.avail_in = W, e.hold = A, e.bits = B, 2;
            v.adler = e.check = 1, e.mode = 12;
          case 12:
            if (z === 5 || z === 6) break t;
          case 13:
            if (e.last) {
              A >>>= 7 & B, B -= 7 & B, e.mode = 27;
              break;
            }
            for (; B < 3; ) {
              if (W === 0) break t;
              W--, A += F[L++] << B, B += 8;
            }
            switch (e.last = 1 & A, B -= 1, 3 & (A >>>= 1)) {
              case 0:
                e.mode = 14;
                break;
              case 1:
                if (q(e), e.mode = 20, z !== 6) break;
                A >>>= 2, B -= 2;
                break t;
              case 2:
                e.mode = 17;
                break;
              case 3:
                v.msg = "invalid block type", e.mode = 30;
            }
            A >>>= 2, B -= 2;
            break;
          case 14:
            for (A >>>= 7 & B, B -= 7 & B; B < 32; ) {
              if (W === 0) break t;
              W--, A += F[L++] << B, B += 8;
            }
            if ((65535 & A) != (A >>> 16 ^ 65535)) {
              v.msg = "invalid stored block lengths", e.mode = 30;
              break;
            }
            if (e.length = 65535 & A, B = A = 0, e.mode = 15, z === 6) break t;
          case 15:
            e.mode = 16;
          case 16:
            if ($ = e.length) {
              if (W < $ && ($ = W), J < $ && ($ = J), $ === 0) break t;
              i.arraySet(Q, F, L, $, tt), W -= $, L += $, J -= $, tt += $, e.length -= $;
              break;
            }
            e.mode = 12;
            break;
          case 17:
            for (; B < 14; ) {
              if (W === 0) break t;
              W--, A += F[L++] << B, B += 8;
            }
            if (e.nlen = 257 + (31 & A), A >>>= 5, B -= 5, e.ndist = 1 + (31 & A), A >>>= 5, B -= 5, e.ncode = 4 + (15 & A), A >>>= 4, B -= 4, 286 < e.nlen || 30 < e.ndist) {
              v.msg = "too many length or distance symbols", e.mode = 30;
              break;
            }
            e.have = 0, e.mode = 18;
          case 18:
            for (; e.have < e.ncode; ) {
              for (; B < 3; ) {
                if (W === 0) break t;
                W--, A += F[L++] << B, B += 8;
              }
              e.lens[R[e.have++]] = 7 & A, A >>>= 3, B -= 3;
            }
            for (; e.have < 19; ) e.lens[R[e.have++]] = 0;
            if (e.lencode = e.lendyn, e.lenbits = 7, C = { bits: e.lenbits }, T = g(0, e.lens, 0, 19, e.lencode, 0, e.work, C), e.lenbits = C.bits, T) {
              v.msg = "invalid code lengths set", e.mode = 30;
              break;
            }
            e.have = 0, e.mode = 19;
          case 19:
            for (; e.have < e.nlen + e.ndist; ) {
              for (; rt = (c = e.lencode[A & (1 << e.lenbits) - 1]) >>> 16 & 255, dt = 65535 & c, !((et = c >>> 24) <= B); ) {
                if (W === 0) break t;
                W--, A += F[L++] << B, B += 8;
              }
              if (dt < 16) A >>>= et, B -= et, e.lens[e.have++] = dt;
              else {
                if (dt === 16) {
                  for (h = et + 2; B < h; ) {
                    if (W === 0) break t;
                    W--, A += F[L++] << B, B += 8;
                  }
                  if (A >>>= et, B -= et, e.have === 0) {
                    v.msg = "invalid bit length repeat", e.mode = 30;
                    break;
                  }
                  t = e.lens[e.have - 1], $ = 3 + (3 & A), A >>>= 2, B -= 2;
                } else if (dt === 17) {
                  for (h = et + 3; B < h; ) {
                    if (W === 0) break t;
                    W--, A += F[L++] << B, B += 8;
                  }
                  B -= et, t = 0, $ = 3 + (7 & (A >>>= et)), A >>>= 3, B -= 3;
                } else {
                  for (h = et + 7; B < h; ) {
                    if (W === 0) break t;
                    W--, A += F[L++] << B, B += 8;
                  }
                  B -= et, t = 0, $ = 11 + (127 & (A >>>= et)), A >>>= 7, B -= 7;
                }
                if (e.have + $ > e.nlen + e.ndist) {
                  v.msg = "invalid bit length repeat", e.mode = 30;
                  break;
                }
                for (; $--; ) e.lens[e.have++] = t;
              }
            }
            if (e.mode === 30) break;
            if (e.lens[256] === 0) {
              v.msg = "invalid code -- missing end-of-block", e.mode = 30;
              break;
            }
            if (e.lenbits = 9, C = { bits: e.lenbits }, T = g(y, e.lens, 0, e.nlen, e.lencode, 0, e.work, C), e.lenbits = C.bits, T) {
              v.msg = "invalid literal/lengths set", e.mode = 30;
              break;
            }
            if (e.distbits = 6, e.distcode = e.distdyn, C = { bits: e.distbits }, T = g(_, e.lens, e.nlen, e.ndist, e.distcode, 0, e.work, C), e.distbits = C.bits, T) {
              v.msg = "invalid distances set", e.mode = 30;
              break;
            }
            if (e.mode = 20, z === 6) break t;
          case 20:
            e.mode = 21;
          case 21:
            if (6 <= W && 258 <= J) {
              v.next_out = tt, v.avail_out = J, v.next_in = L, v.avail_in = W, e.hold = A, e.bits = B, l(v, G), tt = v.next_out, Q = v.output, J = v.avail_out, L = v.next_in, F = v.input, W = v.avail_in, A = e.hold, B = e.bits, e.mode === 12 && (e.back = -1);
              break;
            }
            for (e.back = 0; rt = (c = e.lencode[A & (1 << e.lenbits) - 1]) >>> 16 & 255, dt = 65535 & c, !((et = c >>> 24) <= B); ) {
              if (W === 0) break t;
              W--, A += F[L++] << B, B += 8;
            }
            if (rt && !(240 & rt)) {
              for (st = et, pt = rt, ft = dt; rt = (c = e.lencode[ft + ((A & (1 << st + pt) - 1) >> st)]) >>> 16 & 255, dt = 65535 & c, !(st + (et = c >>> 24) <= B); ) {
                if (W === 0) break t;
                W--, A += F[L++] << B, B += 8;
              }
              A >>>= st, B -= st, e.back += st;
            }
            if (A >>>= et, B -= et, e.back += et, e.length = dt, rt === 0) {
              e.mode = 26;
              break;
            }
            if (32 & rt) {
              e.back = -1, e.mode = 12;
              break;
            }
            if (64 & rt) {
              v.msg = "invalid literal/length code", e.mode = 30;
              break;
            }
            e.extra = 15 & rt, e.mode = 22;
          case 22:
            if (e.extra) {
              for (h = e.extra; B < h; ) {
                if (W === 0) break t;
                W--, A += F[L++] << B, B += 8;
              }
              e.length += A & (1 << e.extra) - 1, A >>>= e.extra, B -= e.extra, e.back += e.extra;
            }
            e.was = e.length, e.mode = 23;
          case 23:
            for (; rt = (c = e.distcode[A & (1 << e.distbits) - 1]) >>> 16 & 255, dt = 65535 & c, !((et = c >>> 24) <= B); ) {
              if (W === 0) break t;
              W--, A += F[L++] << B, B += 8;
            }
            if (!(240 & rt)) {
              for (st = et, pt = rt, ft = dt; rt = (c = e.distcode[ft + ((A & (1 << st + pt) - 1) >> st)]) >>> 16 & 255, dt = 65535 & c, !(st + (et = c >>> 24) <= B); ) {
                if (W === 0) break t;
                W--, A += F[L++] << B, B += 8;
              }
              A >>>= st, B -= st, e.back += st;
            }
            if (A >>>= et, B -= et, e.back += et, 64 & rt) {
              v.msg = "invalid distance code", e.mode = 30;
              break;
            }
            e.offset = dt, e.extra = 15 & rt, e.mode = 24;
          case 24:
            if (e.extra) {
              for (h = e.extra; B < h; ) {
                if (W === 0) break t;
                W--, A += F[L++] << B, B += 8;
              }
              e.offset += A & (1 << e.extra) - 1, A >>>= e.extra, B -= e.extra, e.back += e.extra;
            }
            if (e.offset > e.dmax) {
              v.msg = "invalid distance too far back", e.mode = 30;
              break;
            }
            e.mode = 25;
          case 25:
            if (J === 0) break t;
            if ($ = G - J, e.offset > $) {
              if (($ = e.offset - $) > e.whave && e.sane) {
                v.msg = "invalid distance too far back", e.mode = 30;
                break;
              }
              at = $ > e.wnext ? ($ -= e.wnext, e.wsize - $) : e.wnext - $, $ > e.length && ($ = e.length), ct = e.window;
            } else ct = Q, at = tt - e.offset, $ = e.length;
            for (J < $ && ($ = J), J -= $, e.length -= $; Q[tt++] = ct[at++], --$; ) ;
            e.length === 0 && (e.mode = 21);
            break;
          case 26:
            if (J === 0) break t;
            Q[tt++] = e.length, J--, e.mode = 21;
            break;
          case 27:
            if (e.wrap) {
              for (; B < 32; ) {
                if (W === 0) break t;
                W--, A |= F[L++] << B, B += 8;
              }
              if (G -= J, v.total_out += G, e.total += G, G && (v.adler = e.check = e.flags ? n(e.check, Q, G, tt - G) : s(e.check, Q, G, tt - G)), G = J, (e.flags ? A : o(A)) !== e.check) {
                v.msg = "incorrect data check", e.mode = 30;
                break;
              }
              B = A = 0;
            }
            e.mode = 28;
          case 28:
            if (e.wrap && e.flags) {
              for (; B < 32; ) {
                if (W === 0) break t;
                W--, A += F[L++] << B, B += 8;
              }
              if (A !== (4294967295 & e.total)) {
                v.msg = "incorrect length check", e.mode = 30;
                break;
              }
              B = A = 0;
            }
            e.mode = 29;
          case 29:
            T = 1;
            break t;
          case 30:
            T = -3;
            break t;
          case 31:
            return -4;
          case 32:
          default:
            return a;
        }
        return v.next_out = tt, v.avail_out = J, v.next_in = L, v.avail_in = W, e.hold = A, e.bits = B, (e.wsize || G !== v.avail_out && e.mode < 30 && (e.mode < 27 || z !== 4)) && X(v, v.output, v.next_out, G - v.avail_out) ? (e.mode = 31, -4) : (K -= v.avail_in, G -= v.avail_out, v.total_in += K, v.total_out += G, e.total += G, e.wrap && G && (v.adler = e.check = e.flags ? n(e.check, Q, G, v.next_out - G) : s(e.check, Q, G, v.next_out - G)), v.data_type = e.bits + (e.last ? 64 : 0) + (e.mode === 12 ? 128 : 0) + (e.mode === 20 || e.mode === 15 ? 256 : 0), (K == 0 && G === 0 || z === 4) && T === b && (T = -5), T);
      }, m.inflateEnd = function(v) {
        if (!v || !v.state) return a;
        var z = v.state;
        return z.window && (z.window = null), v.state = null, b;
      }, m.inflateGetHeader = function(v, z) {
        var e;
        return v && v.state && 2 & (e = v.state).wrap ? ((e.head = z).done = !1, b) : a;
      }, m.inflateSetDictionary = function(v, z) {
        var e, F = z.length;
        return v && v.state ? (e = v.state).wrap !== 0 && e.mode !== 11 ? a : e.mode === 11 && s(1, z, F, 0) !== e.check ? -3 : X(v, z, F, F) ? (e.mode = 31, -4) : (e.havedict = 1, b) : a;
      }, m.inflateInfo = "pako inflate (from Nodeca project)";
    }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(d, k, m) {
      var i = d("../utils/common"), s = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], n = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], l = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], g = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
      k.exports = function(y, _, b, a, f, r, u, o) {
        var p, w, S, E, D, N, M, P, q, X = o.bits, v = 0, z = 0, e = 0, F = 0, Q = 0, L = 0, tt = 0, W = 0, J = 0, A = 0, B = null, K = 0, G = new i.Buf16(16), $ = new i.Buf16(16), at = null, ct = 0;
        for (v = 0; v <= 15; v++) G[v] = 0;
        for (z = 0; z < a; z++) G[_[b + z]]++;
        for (Q = X, F = 15; 1 <= F && G[F] === 0; F--) ;
        if (F < Q && (Q = F), F === 0) return f[r++] = 20971520, f[r++] = 20971520, o.bits = 1, 0;
        for (e = 1; e < F && G[e] === 0; e++) ;
        for (Q < e && (Q = e), v = W = 1; v <= 15; v++) if (W <<= 1, (W -= G[v]) < 0) return -1;
        if (0 < W && (y === 0 || F !== 1)) return -1;
        for ($[1] = 0, v = 1; v < 15; v++) $[v + 1] = $[v] + G[v];
        for (z = 0; z < a; z++) _[b + z] !== 0 && (u[$[_[b + z]]++] = z);
        if (N = y === 0 ? (B = at = u, 19) : y === 1 ? (B = s, K -= 257, at = n, ct -= 257, 256) : (B = l, at = g, -1), v = e, D = r, tt = z = A = 0, S = -1, E = (J = 1 << (L = Q)) - 1, y === 1 && 852 < J || y === 2 && 592 < J) return 1;
        for (; ; ) {
          for (M = v - tt, q = u[z] < N ? (P = 0, u[z]) : u[z] > N ? (P = at[ct + u[z]], B[K + u[z]]) : (P = 96, 0), p = 1 << v - tt, e = w = 1 << L; f[D + (A >> tt) + (w -= p)] = M << 24 | P << 16 | q | 0, w !== 0; ) ;
          for (p = 1 << v - 1; A & p; ) p >>= 1;
          if (p !== 0 ? (A &= p - 1, A += p) : A = 0, z++, --G[v] == 0) {
            if (v === F) break;
            v = _[b + u[z]];
          }
          if (Q < v && (A & E) !== S) {
            for (tt === 0 && (tt = Q), D += e, W = 1 << (L = v - tt); L + tt < F && !((W -= G[L + tt]) <= 0); ) L++, W <<= 1;
            if (J += 1 << L, y === 1 && 852 < J || y === 2 && 592 < J) return 1;
            f[S = A & E] = Q << 24 | L << 16 | D - r | 0;
          }
        }
        return A !== 0 && (f[D + A] = v - tt << 24 | 64 << 16 | 0), o.bits = Q, 0;
      };
    }, { "../utils/common": 41 }], 51: [function(d, k, m) {
      k.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
    }, {}], 52: [function(d, k, m) {
      var i = d("../utils/common"), s = 0, n = 1;
      function l(c) {
        for (var x = c.length; 0 <= --x; ) c[x] = 0;
      }
      var g = 0, y = 29, _ = 256, b = _ + 1 + y, a = 30, f = 19, r = 2 * b + 1, u = 15, o = 16, p = 7, w = 256, S = 16, E = 17, D = 18, N = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], M = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], P = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], q = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], X = new Array(2 * (b + 2));
      l(X);
      var v = new Array(2 * a);
      l(v);
      var z = new Array(512);
      l(z);
      var e = new Array(256);
      l(e);
      var F = new Array(y);
      l(F);
      var Q, L, tt, W = new Array(a);
      function J(c, x, R, U, I) {
        this.static_tree = c, this.extra_bits = x, this.extra_base = R, this.elems = U, this.max_length = I, this.has_stree = c && c.length;
      }
      function A(c, x) {
        this.dyn_tree = c, this.max_code = 0, this.stat_desc = x;
      }
      function B(c) {
        return c < 256 ? z[c] : z[256 + (c >>> 7)];
      }
      function K(c, x) {
        c.pending_buf[c.pending++] = 255 & x, c.pending_buf[c.pending++] = x >>> 8 & 255;
      }
      function G(c, x, R) {
        c.bi_valid > o - R ? (c.bi_buf |= x << c.bi_valid & 65535, K(c, c.bi_buf), c.bi_buf = x >> o - c.bi_valid, c.bi_valid += R - o) : (c.bi_buf |= x << c.bi_valid & 65535, c.bi_valid += R);
      }
      function $(c, x, R) {
        G(c, R[2 * x], R[2 * x + 1]);
      }
      function at(c, x) {
        for (var R = 0; R |= 1 & c, c >>>= 1, R <<= 1, 0 < --x; ) ;
        return R >>> 1;
      }
      function ct(c, x, R) {
        var U, I, Z = new Array(u + 1), V = 0;
        for (U = 1; U <= u; U++) Z[U] = V = V + R[U - 1] << 1;
        for (I = 0; I <= x; I++) {
          var H = c[2 * I + 1];
          H !== 0 && (c[2 * I] = at(Z[H]++, H));
        }
      }
      function et(c) {
        var x;
        for (x = 0; x < b; x++) c.dyn_ltree[2 * x] = 0;
        for (x = 0; x < a; x++) c.dyn_dtree[2 * x] = 0;
        for (x = 0; x < f; x++) c.bl_tree[2 * x] = 0;
        c.dyn_ltree[2 * w] = 1, c.opt_len = c.static_len = 0, c.last_lit = c.matches = 0;
      }
      function rt(c) {
        8 < c.bi_valid ? K(c, c.bi_buf) : 0 < c.bi_valid && (c.pending_buf[c.pending++] = c.bi_buf), c.bi_buf = 0, c.bi_valid = 0;
      }
      function dt(c, x, R, U) {
        var I = 2 * x, Z = 2 * R;
        return c[I] < c[Z] || c[I] === c[Z] && U[x] <= U[R];
      }
      function st(c, x, R) {
        for (var U = c.heap[R], I = R << 1; I <= c.heap_len && (I < c.heap_len && dt(x, c.heap[I + 1], c.heap[I], c.depth) && I++, !dt(x, U, c.heap[I], c.depth)); ) c.heap[R] = c.heap[I], R = I, I <<= 1;
        c.heap[R] = U;
      }
      function pt(c, x, R) {
        var U, I, Z, V, H = 0;
        if (c.last_lit !== 0) for (; U = c.pending_buf[c.d_buf + 2 * H] << 8 | c.pending_buf[c.d_buf + 2 * H + 1], I = c.pending_buf[c.l_buf + H], H++, U === 0 ? $(c, I, x) : ($(c, (Z = e[I]) + _ + 1, x), (V = N[Z]) !== 0 && G(c, I -= F[Z], V), $(c, Z = B(--U), R), (V = M[Z]) !== 0 && G(c, U -= W[Z], V)), H < c.last_lit; ) ;
        $(c, w, x);
      }
      function ft(c, x) {
        var R, U, I, Z = x.dyn_tree, V = x.stat_desc.static_tree, H = x.stat_desc.has_stree, Y = x.stat_desc.elems, it = -1;
        for (c.heap_len = 0, c.heap_max = r, R = 0; R < Y; R++) Z[2 * R] !== 0 ? (c.heap[++c.heap_len] = it = R, c.depth[R] = 0) : Z[2 * R + 1] = 0;
        for (; c.heap_len < 2; ) Z[2 * (I = c.heap[++c.heap_len] = it < 2 ? ++it : 0)] = 1, c.depth[I] = 0, c.opt_len--, H && (c.static_len -= V[2 * I + 1]);
        for (x.max_code = it, R = c.heap_len >> 1; 1 <= R; R--) st(c, Z, R);
        for (I = Y; R = c.heap[1], c.heap[1] = c.heap[c.heap_len--], st(c, Z, 1), U = c.heap[1], c.heap[--c.heap_max] = R, c.heap[--c.heap_max] = U, Z[2 * I] = Z[2 * R] + Z[2 * U], c.depth[I] = (c.depth[R] >= c.depth[U] ? c.depth[R] : c.depth[U]) + 1, Z[2 * R + 1] = Z[2 * U + 1] = I, c.heap[1] = I++, st(c, Z, 1), 2 <= c.heap_len; ) ;
        c.heap[--c.heap_max] = c.heap[1], function(nt, ht) {
          var vt, mt, yt, ot, St, zt, gt = ht.dyn_tree, Mt = ht.max_code, Yt = ht.stat_desc.static_tree, Kt = ht.stat_desc.has_stree, Xt = ht.stat_desc.extra_bits, jt = ht.stat_desc.extra_base, wt = ht.stat_desc.max_length, It = 0;
          for (ot = 0; ot <= u; ot++) nt.bl_count[ot] = 0;
          for (gt[2 * nt.heap[nt.heap_max] + 1] = 0, vt = nt.heap_max + 1; vt < r; vt++) wt < (ot = gt[2 * gt[2 * (mt = nt.heap[vt]) + 1] + 1] + 1) && (ot = wt, It++), gt[2 * mt + 1] = ot, Mt < mt || (nt.bl_count[ot]++, St = 0, jt <= mt && (St = Xt[mt - jt]), zt = gt[2 * mt], nt.opt_len += zt * (ot + St), Kt && (nt.static_len += zt * (Yt[2 * mt + 1] + St)));
          if (It !== 0) {
            do {
              for (ot = wt - 1; nt.bl_count[ot] === 0; ) ot--;
              nt.bl_count[ot]--, nt.bl_count[ot + 1] += 2, nt.bl_count[wt]--, It -= 2;
            } while (0 < It);
            for (ot = wt; ot !== 0; ot--) for (mt = nt.bl_count[ot]; mt !== 0; ) Mt < (yt = nt.heap[--vt]) || (gt[2 * yt + 1] !== ot && (nt.opt_len += (ot - gt[2 * yt + 1]) * gt[2 * yt], gt[2 * yt + 1] = ot), mt--);
          }
        }(c, x), ct(Z, it, c.bl_count);
      }
      function t(c, x, R) {
        var U, I, Z = -1, V = x[1], H = 0, Y = 7, it = 4;
        for (V === 0 && (Y = 138, it = 3), x[2 * (R + 1) + 1] = 65535, U = 0; U <= R; U++) I = V, V = x[2 * (U + 1) + 1], ++H < Y && I === V || (H < it ? c.bl_tree[2 * I] += H : I !== 0 ? (I !== Z && c.bl_tree[2 * I]++, c.bl_tree[2 * S]++) : H <= 10 ? c.bl_tree[2 * E]++ : c.bl_tree[2 * D]++, Z = I, it = (H = 0) === V ? (Y = 138, 3) : I === V ? (Y = 6, 3) : (Y = 7, 4));
      }
      function T(c, x, R) {
        var U, I, Z = -1, V = x[1], H = 0, Y = 7, it = 4;
        for (V === 0 && (Y = 138, it = 3), U = 0; U <= R; U++) if (I = V, V = x[2 * (U + 1) + 1], !(++H < Y && I === V)) {
          if (H < it) for (; $(c, I, c.bl_tree), --H != 0; ) ;
          else I !== 0 ? (I !== Z && ($(c, I, c.bl_tree), H--), $(c, S, c.bl_tree), G(c, H - 3, 2)) : H <= 10 ? ($(c, E, c.bl_tree), G(c, H - 3, 3)) : ($(c, D, c.bl_tree), G(c, H - 11, 7));
          Z = I, it = (H = 0) === V ? (Y = 138, 3) : I === V ? (Y = 6, 3) : (Y = 7, 4);
        }
      }
      l(W);
      var C = !1;
      function h(c, x, R, U) {
        G(c, (g << 1) + (U ? 1 : 0), 3), function(I, Z, V, H) {
          rt(I), K(I, V), K(I, ~V), i.arraySet(I.pending_buf, I.window, Z, V, I.pending), I.pending += V;
        }(c, x, R);
      }
      m._tr_init = function(c) {
        C || (function() {
          var x, R, U, I, Z, V = new Array(u + 1);
          for (I = U = 0; I < y - 1; I++) for (F[I] = U, x = 0; x < 1 << N[I]; x++) e[U++] = I;
          for (e[U - 1] = I, I = Z = 0; I < 16; I++) for (W[I] = Z, x = 0; x < 1 << M[I]; x++) z[Z++] = I;
          for (Z >>= 7; I < a; I++) for (W[I] = Z << 7, x = 0; x < 1 << M[I] - 7; x++) z[256 + Z++] = I;
          for (R = 0; R <= u; R++) V[R] = 0;
          for (x = 0; x <= 143; ) X[2 * x + 1] = 8, x++, V[8]++;
          for (; x <= 255; ) X[2 * x + 1] = 9, x++, V[9]++;
          for (; x <= 279; ) X[2 * x + 1] = 7, x++, V[7]++;
          for (; x <= 287; ) X[2 * x + 1] = 8, x++, V[8]++;
          for (ct(X, b + 1, V), x = 0; x < a; x++) v[2 * x + 1] = 5, v[2 * x] = at(x, 5);
          Q = new J(X, N, _ + 1, b, u), L = new J(v, M, 0, a, u), tt = new J(new Array(0), P, 0, f, p);
        }(), C = !0), c.l_desc = new A(c.dyn_ltree, Q), c.d_desc = new A(c.dyn_dtree, L), c.bl_desc = new A(c.bl_tree, tt), c.bi_buf = 0, c.bi_valid = 0, et(c);
      }, m._tr_stored_block = h, m._tr_flush_block = function(c, x, R, U) {
        var I, Z, V = 0;
        0 < c.level ? (c.strm.data_type === 2 && (c.strm.data_type = function(H) {
          var Y, it = 4093624447;
          for (Y = 0; Y <= 31; Y++, it >>>= 1) if (1 & it && H.dyn_ltree[2 * Y] !== 0) return s;
          if (H.dyn_ltree[18] !== 0 || H.dyn_ltree[20] !== 0 || H.dyn_ltree[26] !== 0) return n;
          for (Y = 32; Y < _; Y++) if (H.dyn_ltree[2 * Y] !== 0) return n;
          return s;
        }(c)), ft(c, c.l_desc), ft(c, c.d_desc), V = function(H) {
          var Y;
          for (t(H, H.dyn_ltree, H.l_desc.max_code), t(H, H.dyn_dtree, H.d_desc.max_code), ft(H, H.bl_desc), Y = f - 1; 3 <= Y && H.bl_tree[2 * q[Y] + 1] === 0; Y--) ;
          return H.opt_len += 3 * (Y + 1) + 5 + 5 + 4, Y;
        }(c), I = c.opt_len + 3 + 7 >>> 3, (Z = c.static_len + 3 + 7 >>> 3) <= I && (I = Z)) : I = Z = R + 5, R + 4 <= I && x !== -1 ? h(c, x, R, U) : c.strategy === 4 || Z === I ? (G(c, 2 + (U ? 1 : 0), 3), pt(c, X, v)) : (G(c, 4 + (U ? 1 : 0), 3), function(H, Y, it, nt) {
          var ht;
          for (G(H, Y - 257, 5), G(H, it - 1, 5), G(H, nt - 4, 4), ht = 0; ht < nt; ht++) G(H, H.bl_tree[2 * q[ht] + 1], 3);
          T(H, H.dyn_ltree, Y - 1), T(H, H.dyn_dtree, it - 1);
        }(c, c.l_desc.max_code + 1, c.d_desc.max_code + 1, V + 1), pt(c, c.dyn_ltree, c.dyn_dtree)), et(c), U && rt(c);
      }, m._tr_tally = function(c, x, R) {
        return c.pending_buf[c.d_buf + 2 * c.last_lit] = x >>> 8 & 255, c.pending_buf[c.d_buf + 2 * c.last_lit + 1] = 255 & x, c.pending_buf[c.l_buf + c.last_lit] = 255 & R, c.last_lit++, x === 0 ? c.dyn_ltree[2 * R]++ : (c.matches++, x--, c.dyn_ltree[2 * (e[R] + _ + 1)]++, c.dyn_dtree[2 * B(x)]++), c.last_lit === c.lit_bufsize - 1;
      }, m._tr_align = function(c) {
        G(c, 2, 3), $(c, w, X), function(x) {
          x.bi_valid === 16 ? (K(x, x.bi_buf), x.bi_buf = 0, x.bi_valid = 0) : 8 <= x.bi_valid && (x.pending_buf[x.pending++] = 255 & x.bi_buf, x.bi_buf >>= 8, x.bi_valid -= 8);
        }(c);
      };
    }, { "../utils/common": 41 }], 53: [function(d, k, m) {
      k.exports = function() {
        this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
      };
    }, {}], 54: [function(d, k, m) {
      (function(i) {
        (function(s, n) {
          if (!s.setImmediate) {
            var l, g, y, _, b = 1, a = {}, f = !1, r = s.document, u = Object.getPrototypeOf && Object.getPrototypeOf(s);
            u = u && u.setTimeout ? u : s, l = {}.toString.call(s.process) === "[object process]" ? function(S) {
              process.nextTick(function() {
                p(S);
              });
            } : function() {
              if (s.postMessage && !s.importScripts) {
                var S = !0, E = s.onmessage;
                return s.onmessage = function() {
                  S = !1;
                }, s.postMessage("", "*"), s.onmessage = E, S;
              }
            }() ? (_ = "setImmediate$" + Math.random() + "$", s.addEventListener ? s.addEventListener("message", w, !1) : s.attachEvent("onmessage", w), function(S) {
              s.postMessage(_ + S, "*");
            }) : s.MessageChannel ? ((y = new MessageChannel()).port1.onmessage = function(S) {
              p(S.data);
            }, function(S) {
              y.port2.postMessage(S);
            }) : r && "onreadystatechange" in r.createElement("script") ? (g = r.documentElement, function(S) {
              var E = r.createElement("script");
              E.onreadystatechange = function() {
                p(S), E.onreadystatechange = null, g.removeChild(E), E = null;
              }, g.appendChild(E);
            }) : function(S) {
              setTimeout(p, 0, S);
            }, u.setImmediate = function(S) {
              typeof S != "function" && (S = new Function("" + S));
              for (var E = new Array(arguments.length - 1), D = 0; D < E.length; D++) E[D] = arguments[D + 1];
              var N = { callback: S, args: E };
              return a[b] = N, l(b), b++;
            }, u.clearImmediate = o;
          }
          function o(S) {
            delete a[S];
          }
          function p(S) {
            if (f) setTimeout(p, 0, S);
            else {
              var E = a[S];
              if (E) {
                f = !0;
                try {
                  (function(D) {
                    var N = D.callback, M = D.args;
                    switch (M.length) {
                      case 0:
                        N();
                        break;
                      case 1:
                        N(M[0]);
                        break;
                      case 2:
                        N(M[0], M[1]);
                        break;
                      case 3:
                        N(M[0], M[1], M[2]);
                        break;
                      default:
                        N.apply(n, M);
                    }
                  })(E);
                } finally {
                  o(S), f = !1;
                }
              }
            }
          }
          function w(S) {
            S.source === s && typeof S.data == "string" && S.data.indexOf(_) === 0 && p(+S.data.slice(_.length));
          }
        })(typeof self > "u" ? i === void 0 ? this : i : self);
      }).call(this, typeof Bt < "u" ? Bt : typeof self < "u" ? self : typeof window < "u" ? window : {});
    }, {}] }, {}, [10])(10);
  });
})(Zt);
var Qt = Zt.exports;
const te = /* @__PURE__ */ Jt(Qt);
/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */
var ee = Object.prototype.toString, bt = Array.isArray || function(O) {
  return ee.call(O) === "[object Array]";
};
function Ft(j) {
  return typeof j == "function";
}
function ne(j) {
  return bt(j) ? "array" : typeof j;
}
function Tt(j) {
  return j.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
}
function Ut(j, O) {
  return j != null && typeof j == "object" && O in j;
}
function re(j, O) {
  return j != null && typeof j != "object" && j.hasOwnProperty && j.hasOwnProperty(O);
}
var ie = RegExp.prototype.test;
function ae(j, O) {
  return ie.call(j, O);
}
var se = /\S/;
function oe(j) {
  return !ae(se, j);
}
var le = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;",
  "`": "&#x60;",
  "=": "&#x3D;"
};
function de(j) {
  return String(j).replace(/[&<>"'`=\/]/g, function(d) {
    return le[d];
  });
}
var ce = /\s*/, ue = /\s+/, Lt = /\s*=/, he = /\s*\}/, fe = /#|\^|\/|>|\{|&|=|!/;
function pe(j, O) {
  if (!j)
    return [];
  var d = !1, k = [], m = [], i = [], s = !1, n = !1, l = "", g = 0;
  function y() {
    if (s && !n)
      for (; i.length; )
        delete m[i.pop()];
    else
      i = [];
    s = !1, n = !1;
  }
  var _, b, a;
  function f(M) {
    if (typeof M == "string" && (M = M.split(ue, 2)), !bt(M) || M.length !== 2)
      throw new Error("Invalid tags: " + M);
    _ = new RegExp(Tt(M[0]) + "\\s*"), b = new RegExp("\\s*" + Tt(M[1])), a = new RegExp("\\s*" + Tt("}" + M[1]));
  }
  f(O || lt.tags);
  for (var r = new xt(j), u, o, p, w, S, E; !r.eos(); ) {
    if (u = r.pos, p = r.scanUntil(_), p)
      for (var D = 0, N = p.length; D < N; ++D)
        w = p.charAt(D), oe(w) ? (i.push(m.length), l += w) : (n = !0, d = !0, l += " "), m.push(["text", w, u, u + 1]), u += 1, w === `
` && (y(), l = "", g = 0, d = !1);
    if (!r.scan(_))
      break;
    if (s = !0, o = r.scan(fe) || "name", r.scan(ce), o === "=" ? (p = r.scanUntil(Lt), r.scan(Lt), r.scanUntil(b)) : o === "{" ? (p = r.scanUntil(a), r.scan(he), r.scanUntil(b), o = "&") : p = r.scanUntil(b), !r.scan(b))
      throw new Error("Unclosed tag at " + r.pos);
    if (o == ">" ? S = [o, p, u, r.pos, l, g, d] : S = [o, p, u, r.pos], g++, m.push(S), o === "#" || o === "^")
      k.push(S);
    else if (o === "/") {
      if (E = k.pop(), !E)
        throw new Error('Unopened section "' + p + '" at ' + u);
      if (E[1] !== p)
        throw new Error('Unclosed section "' + E[1] + '" at ' + u);
    } else o === "name" || o === "{" || o === "&" ? n = !0 : o === "=" && f(p);
  }
  if (y(), E = k.pop(), E)
    throw new Error('Unclosed section "' + E[1] + '" at ' + r.pos);
  return ge(me(m));
}
function me(j) {
  for (var O = [], d, k, m = 0, i = j.length; m < i; ++m)
    d = j[m], d && (d[0] === "text" && k && k[0] === "text" ? (k[1] += d[1], k[3] = d[3]) : (O.push(d), k = d));
  return O;
}
function ge(j) {
  for (var O = [], d = O, k = [], m, i, s = 0, n = j.length; s < n; ++s)
    switch (m = j[s], m[0]) {
      case "#":
      case "^":
        d.push(m), k.push(m), d = m[4] = [];
        break;
      case "/":
        i = k.pop(), i[5] = m[2], d = k.length > 0 ? k[k.length - 1][4] : O;
        break;
      default:
        d.push(m);
    }
  return O;
}
function xt(j) {
  this.string = j, this.tail = j, this.pos = 0;
}
xt.prototype.eos = function() {
  return this.tail === "";
};
xt.prototype.scan = function(O) {
  var d = this.tail.match(O);
  if (!d || d.index !== 0)
    return "";
  var k = d[0];
  return this.tail = this.tail.substring(k.length), this.pos += k.length, k;
};
xt.prototype.scanUntil = function(O) {
  var d = this.tail.search(O), k;
  switch (d) {
    case -1:
      k = this.tail, this.tail = "";
      break;
    case 0:
      k = "";
      break;
    default:
      k = this.tail.substring(0, d), this.tail = this.tail.substring(d);
  }
  return this.pos += k.length, k;
};
function _t(j, O) {
  this.view = j, this.cache = { ".": this.view }, this.parent = O;
}
_t.prototype.push = function(O) {
  return new _t(O, this);
};
_t.prototype.lookup = function(O) {
  var d = this.cache, k;
  if (d.hasOwnProperty(O))
    k = d[O];
  else {
    for (var m = this, i, s, n, l = !1; m; ) {
      if (O.indexOf(".") > 0)
        for (i = m.view, s = O.split("."), n = 0; i != null && n < s.length; )
          n === s.length - 1 && (l = Ut(i, s[n]) || re(i, s[n])), i = i[s[n++]];
      else
        i = m.view[O], l = Ut(m.view, O);
      if (l) {
        k = i;
        break;
      }
      m = m.parent;
    }
    d[O] = k;
  }
  return Ft(k) && (k = k.call(this.view)), k;
};
function ut() {
  this.templateCache = {
    _cache: {},
    set: function(O, d) {
      this._cache[O] = d;
    },
    get: function(O) {
      return this._cache[O];
    },
    clear: function() {
      this._cache = {};
    }
  };
}
ut.prototype.clearCache = function() {
  typeof this.templateCache < "u" && this.templateCache.clear();
};
ut.prototype.parse = function(O, d) {
  var k = this.templateCache, m = O + ":" + (d || lt.tags).join(":"), i = typeof k < "u", s = i ? k.get(m) : void 0;
  return s == null && (s = pe(O, d), i && k.set(m, s)), s;
};
ut.prototype.render = function(O, d, k, m) {
  var i = this.getConfigTags(m), s = this.parse(O, i), n = d instanceof _t ? d : new _t(d, void 0);
  return this.renderTokens(s, n, k, O, m);
};
ut.prototype.renderTokens = function(O, d, k, m, i) {
  for (var s = "", n, l, g, y = 0, _ = O.length; y < _; ++y)
    g = void 0, n = O[y], l = n[0], l === "#" ? g = this.renderSection(n, d, k, m, i) : l === "^" ? g = this.renderInverted(n, d, k, m, i) : l === ">" ? g = this.renderPartial(n, d, k, i) : l === "&" ? g = this.unescapedValue(n, d) : l === "name" ? g = this.escapedValue(n, d, i) : l === "text" && (g = this.rawValue(n)), g !== void 0 && (s += g);
  return s;
};
ut.prototype.renderSection = function(O, d, k, m, i) {
  var s = this, n = "", l = d.lookup(O[1]);
  function g(b) {
    return s.render(b, d, k, i);
  }
  if (l) {
    if (bt(l))
      for (var y = 0, _ = l.length; y < _; ++y)
        n += this.renderTokens(O[4], d.push(l[y]), k, m, i);
    else if (typeof l == "object" || typeof l == "string" || typeof l == "number")
      n += this.renderTokens(O[4], d.push(l), k, m, i);
    else if (Ft(l)) {
      if (typeof m != "string")
        throw new Error("Cannot use higher-order sections without the original template");
      l = l.call(d.view, m.slice(O[3], O[5]), g), l != null && (n += l);
    } else
      n += this.renderTokens(O[4], d, k, m, i);
    return n;
  }
};
ut.prototype.renderInverted = function(O, d, k, m, i) {
  var s = d.lookup(O[1]);
  if (!s || bt(s) && s.length === 0)
    return this.renderTokens(O[4], d, k, m, i);
};
ut.prototype.indentPartial = function(O, d, k) {
  for (var m = d.replace(/[^ \t]/g, ""), i = O.split(`
`), s = 0; s < i.length; s++)
    i[s].length && (s > 0 || !k) && (i[s] = m + i[s]);
  return i.join(`
`);
};
ut.prototype.renderPartial = function(O, d, k, m) {
  if (k) {
    var i = this.getConfigTags(m), s = Ft(k) ? k(O[1]) : k[O[1]];
    if (s != null) {
      var n = O[6], l = O[5], g = O[4], y = s;
      l == 0 && g && (y = this.indentPartial(s, g, n));
      var _ = this.parse(y, i);
      return this.renderTokens(_, d, k, y, m);
    }
  }
};
ut.prototype.unescapedValue = function(O, d) {
  var k = d.lookup(O[1]);
  if (k != null)
    return k;
};
ut.prototype.escapedValue = function(O, d, k) {
  var m = this.getConfigEscape(k) || lt.escape, i = d.lookup(O[1]);
  if (i != null)
    return typeof i == "number" && m === lt.escape ? String(i) : m(i);
};
ut.prototype.rawValue = function(O) {
  return O[1];
};
ut.prototype.getConfigTags = function(O) {
  return bt(O) ? O : O && typeof O == "object" ? O.tags : void 0;
};
ut.prototype.getConfigEscape = function(O) {
  if (O && typeof O == "object" && !bt(O))
    return O.escape;
};
var lt = {
  name: "mustache.js",
  version: "4.2.0",
  tags: ["{{", "}}"],
  clearCache: void 0,
  escape: void 0,
  parse: void 0,
  render: void 0,
  Scanner: void 0,
  Context: void 0,
  Writer: void 0,
  /**
   * Allows a user to override the default caching strategy, by providing an
   * object with set, get and clear methods. This can also be used to disable
   * the cache by setting it to the literal `undefined`.
   */
  set templateCache(j) {
    kt.templateCache = j;
  },
  /**
   * Gets the default or overridden caching object from the default writer.
   */
  get templateCache() {
    return kt.templateCache;
  }
}, kt = new ut();
lt.clearCache = function() {
  return kt.clearCache();
};
lt.parse = function(O, d) {
  return kt.parse(O, d);
};
lt.render = function(O, d, k, m) {
  if (typeof O != "string")
    throw new TypeError('Invalid template! Template should be a "string" but "' + ne(O) + '" was given as the first argument for mustache#render(template, view, partials)');
  return kt.render(O, d, k, m);
};
lt.escape = de;
lt.Scanner = xt;
lt.Context = _t;
lt.Writer = ut;
const _e = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	
	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>{{springBootVersion}}</version>
		<relativePath/> <!-- lookup parent from repository -->
	</parent>
	
	<groupId>{{groupId}}</groupId>
	<artifactId>{{artifactId}}</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<name>{{projectName}}</name>
	<description>FINOS Fluxnova Spring Boot Application generated by Fluxnova Initializer</description>
	
	<properties>
		<java.version>21</java.version>
		<fluxnova.version>{{fluxnovaVersion}}</fluxnova.version>
	</properties>

	<dependencyManagement>
		<dependencies>
			<dependency>
				<groupId>org.finos.fluxnova.bpm</groupId>
				<artifactId>fluxnova-bom</artifactId>
				<version>\${fluxnova.version}</version>
				<scope>import</scope>
				<type>pom</type>
			</dependency>
		</dependencies>
	</dependencyManagement>

	<dependencies>
		<!-- Engine Starter -->
		<dependency>
			<groupId>org.finos.fluxnova.bpm.springboot</groupId>
			<artifactId>fluxnova-bpm-spring-boot-starter</artifactId>
		</dependency>
		
		{{#features.cockpit}}
		<!-- Webapps (Cockpit, Tasklist, Admin) -->
		<dependency>
			<groupId>org.finos.fluxnova.bpm.springboot</groupId>
			<artifactId>fluxnova-bpm-spring-boot-starter-webapp</artifactId>
			<version>\${fluxnova.version}</version>
		</dependency>
		{{/features.cockpit}}

		{{#features.restApi}}
		<!-- REST API -->
		<dependency>
			<groupId>org.finos.fluxnova.bpm.springboot</groupId>
			<artifactId>fluxnova-bpm-spring-boot-starter-rest</artifactId>
			<version>\${fluxnova.version}</version>
		</dependency>
		{{/features.restApi}}

		<!-- Database dependencies -->
		{{#isH2}}
		<dependency>
			<groupId>com.h2database</groupId>
			<artifactId>h2</artifactId>
			<scope>runtime</scope>
		</dependency>
		{{/isH2}}
		{{#isMysql}}
		<dependency>
			<groupId>com.mysql</groupId>
			<artifactId>mysql-connector-j</artifactId>
			<scope>runtime</scope>
		</dependency>
		{{/isMysql}}
		{{#isPostgresql}}
		<dependency>
			<groupId>org.postgresql</groupId>
			<artifactId>postgresql</artifactId>
			<scope>runtime</scope>
		</dependency>
		{{/isPostgresql}}

		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-jdbc</artifactId>
		</dependency>
		
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>

		

		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
		</dependency>
	</dependencies>

	<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
			</plugin>
		</plugins>
	</build>

</project>
`, be = `spring:
  application:
    name: {{projectName}}
  datasource:
    {{#isH2}}
    url: jdbc:h2:mem:fluxnova;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
    driver-class-name: org.h2.Driver
    username: sa
    password: sa
    {{/isH2}}
    {{#isMysql}}
    url: jdbc:mysql://localhost:3306/{{artifactId}}?useTimezone=true&serverTimezone=UTC
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: root
    password: password
    {{/isMysql}}
    {{#isPostgresql}}
    url: jdbc:postgresql://localhost:5432/{{artifactId}}
    driver-class-name: org.postgresql.Driver
    username: postgres
    password: password
    {{/isPostgresql}}
  {{#isH2}}
  h2:
    console:
      enabled: true
      path: /h2-console
  {{/isH2}}
  

server:
  port: 8080

fluxnova:
  bpm:
    admin-user:
      id: {{adminUser}}
      password: {{adminPassword}}
      firstName: Admin
    {{#features.cockpit}}
    webapp:
      index-redirect-enabled: true
     {{/features.cockpit}}
    auto-deployment-enabled: true

logging:
  level:
    org.finos.fluxnova.bpm: INFO
`, ve = `package {{packageName}};

import org.finos.fluxnova.bpm.spring.boot.starter.annotation.EnableProcessApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableProcessApplication
public class {{mainClassName}} {

    public static void main(String[] args) {
        SpringApplication.run({{mainClassName}}.class, args);
    }
}
`, ye = `package {{packageName}}.delegate;

import org.finos.fluxnova.bpm.engine.delegate.DelegateExecution;
import org.finos.fluxnova.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component("sampleDelegate")
public class {{delegateClassName}} implements JavaDelegate {

    private static final Logger logger = LoggerFactory.getLogger({{delegateClassName}}.class);

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        logger.info("Executing sample delegate for process: {}", execution.getProcessInstanceId());
        // Add your custom business logic here
    }
}
`, we = `package {{packageName}};

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class {{mainClassName}}Tests {

    @Test
    void contextLoads() {
        // Verifies that the Spring application context can be loaded successfully.
    }

}
`, ke = `# Build stage
FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app

COPY pom.xml ./
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app

COPY --from=build /app/target/{{artifactId}}-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
`, xe = `# {{projectName}}

This project was generated using the **Fluxnova Initializer**.

## Technology Stack
- **Spring Boot**: {{springBootVersion}}
- **Fluxnova**: {{fluxnovaVersion}}
- **Java**: 21
- **Database**: {{database}}

## Prerequisites
- Java 21
- Maven 3.9+
{{#features.docker}}
- Docker (optional, for containerization)
{{/features.docker}}
{{#features.dockerCompose}}
- Docker Compose (for running dependencies locally)
{{/features.dockerCompose}}

## Getting Started

### 1. Build the project
\`\`\`bash
mvn clean install
\`\`\`

### 2. Run the application
{{#features.dockerCompose}}
If you are using MySQL or PostgreSQL, you might want to start the database first:
\`\`\`bash
docker-compose up -d db
\`\`\`
{{/features.dockerCompose}}

Start the Spring Boot app:
\`\`\`bash
mvn spring-boot:run
\`\`\`

### 3. Access Fluxnova

{{#isH2}}
- **H2 Console**: [http://localhost:8080/h2-console](http://localhost:8080/h2-console) (JDBC URL: \`jdbc:h2:mem:fluxnova\`, User: \`sa\`, Password: \`sa\`)
{{/isH2}}
{{#isMysql}}
- **MySQL Database**: Access your database on \`localhost:3306\` (Database: \`{{artifactId}}\`, User: \`root\`, Password: \`password\`)
{{/isMysql}}
{{#isPostgresql}}
- **PostgreSQL Database**: Access your database on \`localhost:5432\` (Database: \`{{artifactId}}\`, User: \`postgres\`, Password: \`password\`)
{{/isPostgresql}}
{{#features.cockpit}}
- **Fluxnova Cockpit**: [http://localhost:8080/app/cockpit](http://localhost:8080/app/cockpit)
{{/features.cockpit}}
{{#features.tasklist}}
- **Fluxnova Tasklist**: [http://localhost:8080/app/tasklist](http://localhost:8080/app/tasklist)
{{/features.tasklist}}

**Default Admin Credentials:**
- Username: \`{{adminUser}}\`
- Password: \`{{adminPassword}}\`

{{#features.restApi}}
### REST API
List deployed process definitions:
\`\`\`bash
curl http://localhost:8080/engine-rest/process-definition
\`\`\`
{{/features.restApi}}

## Project Structure
\`\`\`
{{artifactId}}/
├── pom.xml
├── src/main/java/{{packagePath}}/
│   ├── {{mainClassName}}.java
│   └── delegate/{{delegateClassName}}.java
└── src/main/resources/
    ├── application.yml
    └── processes/
        └── {{processId}}.bpmn
\`\`\`

## How to Deploy a Process
Place your \`.bpmn\` files in \`src/main/resources/processes/\`. FINOS Fluxnova will automatically deploy them when the application starts.
`, Ee = `target/
!.mvn/wrapper/maven-wrapper.jar
!**/src/main/**/target/
!**/src/test/**/target/

### IntelliJ IDEA ###
.idea
*.iws
*.iml
*.ipr

### Eclipse ###
.apt_generated
.classpath
.factorypath
.project
.settings
.springBeans
.sts4-cache

### NetBeans ###
/nbproject/private/
/nbbuild/
/dist/
/nbdist/
/.nb-gradle/
build/
!**/src/main/**/build/
!**/src/test/**/build/

### VS Code ###
.vscode/

### Mac OS ###
.DS_Store

### Others ###
*.log
.env
`, qt = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="{{processId}}" name="{{projectName}}" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1" name="Start Process">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Activity_1" />
    <bpmn:serviceTask id="Activity_1" name="Sample Service Task" camunda:class="{{packageName}}.delegate.{{delegateClassName}}">
      <bpmn:incoming>Flow_1</bpmn:incoming>
      <bpmn:outgoing>Flow_2</bpmn:outgoing>
    </bpmn:serviceTask>
    <bpmn:endEvent id="EndEvent_1" name="End Process">
      <bpmn:incoming>Flow_2</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_2" sourceRef="Activity_1" targetRef="EndEvent_1" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="{{processId}}">
      <bpmndi:BPMNEdge id="Flow_2_di" bpmnElement="Flow_2">
        <di:waypoint x="370" y="117" />
        <di:waypoint x="432" y="117" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1_di" bpmnElement="Flow_1">
        <di:waypoint x="215" y="117" />
        <di:waypoint x="270" y="117" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="179" y="99" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="164" y="142" width="67" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1_di" bpmnElement="Activity_1">
        <dc:Bounds x="270" y="77" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_1_di" bpmnElement="EndEvent_1">
        <dc:Bounds x="432" y="99" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="420" y="142" width="63" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`, Se = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="{{processId}}" name="Leave Approval" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1" name="Leave Request Submitted">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Activity_User" />
    <bpmn:userTask id="Activity_User" name="Approve Leave" camunda:assignee="demo">
      <bpmn:incoming>Flow_1</bpmn:incoming>
      <bpmn:outgoing>Flow_2</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:sequenceFlow id="Flow_2" sourceRef="Activity_User" targetRef="Activity_Service" />
    <bpmn:serviceTask id="Activity_Service" name="System Notification" camunda:class="{{packageName}}.delegate.{{delegateClassName}}">
      <bpmn:incoming>Flow_2</bpmn:incoming>
      <bpmn:outgoing>Flow_3</bpmn:outgoing>
    </bpmn:serviceTask>
    <bpmn:endEvent id="EndEvent_1" name="Leave Approved">
      <bpmn:incoming>Flow_3</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_3" sourceRef="Activity_Service" targetRef="EndEvent_1" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="{{processId}}">
      <bpmndi:BPMNEdge id="Flow_3_di" bpmnElement="Flow_3">
        <di:waypoint x="530" y="117" />
        <di:waypoint x="592" y="117" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_2_di" bpmnElement="Flow_2">
        <di:waypoint x="370" y="117" />
        <di:waypoint x="430" y="117" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1_di" bpmnElement="Flow_1">
        <di:waypoint x="215" y="117" />
        <di:waypoint x="270" y="117" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="179" y="99" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="160" y="142" width="75" height="27" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_User_di" bpmnElement="Activity_User">
        <dc:Bounds x="270" y="77" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_Service_di" bpmnElement="Activity_Service">
        <dc:Bounds x="430" y="77" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_1_di" bpmnElement="EndEvent_1">
        <dc:Bounds x="592" y="99" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="571" y="142" width="80" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`, Ie = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="{{processId}}" name="Invoice Approval" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1" name="Invoice Received">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Activity_User" />
    <bpmn:userTask id="Activity_User" name="Review Invoice" camunda:assignee="demo">
      <bpmn:incoming>Flow_1</bpmn:incoming>
      <bpmn:outgoing>Flow_2</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:sequenceFlow id="Flow_2" sourceRef="Activity_User" targetRef="Activity_Service" />
    <bpmn:serviceTask id="Activity_Service" name="Process Payment" camunda:class="{{packageName}}.delegate.{{delegateClassName}}">
      <bpmn:incoming>Flow_2</bpmn:incoming>
      <bpmn:outgoing>Flow_3</bpmn:outgoing>
    </bpmn:serviceTask>
    <bpmn:endEvent id="EndEvent_1" name="Invoice Paid">
      <bpmn:incoming>Flow_3</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_3" sourceRef="Activity_Service" targetRef="EndEvent_1" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="{{processId}}">
      <bpmndi:BPMNEdge id="Flow_3_di" bpmnElement="Flow_3">
        <di:waypoint x="530" y="117" />
        <di:waypoint x="592" y="117" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_2_di" bpmnElement="Flow_2">
        <di:waypoint x="370" y="117" />
        <di:waypoint x="430" y="117" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1_di" bpmnElement="Flow_1">
        <di:waypoint x="215" y="117" />
        <di:waypoint x="270" y="117" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="179" y="99" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="156" y="142" width="83" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_User_di" bpmnElement="Activity_User">
        <dc:Bounds x="270" y="77" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_Service_di" bpmnElement="Activity_Service">
        <dc:Bounds x="430" y="77" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_1_di" bpmnElement="EndEvent_1">
        <dc:Bounds x="592" y="99" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="581" y="142" width="59" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`, Be = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="{{processId}}" name="Employee Onboarding" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1" name="New Employee Hired">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Activity_User" />
    <bpmn:userTask id="Activity_User" name="Setup Equipment" camunda:assignee="demo">
      <bpmn:incoming>Flow_1</bpmn:incoming>
      <bpmn:outgoing>Flow_2</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:sequenceFlow id="Flow_2" sourceRef="Activity_User" targetRef="Activity_Service" />
    <bpmn:serviceTask id="Activity_Service" name="Create IT Accounts" camunda:class="{{packageName}}.delegate.{{delegateClassName}}">
      <bpmn:incoming>Flow_2</bpmn:incoming>
      <bpmn:outgoing>Flow_3</bpmn:outgoing>
    </bpmn:serviceTask>
    <bpmn:endEvent id="EndEvent_1" name="Onboarding Complete">
      <bpmn:incoming>Flow_3</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_3" sourceRef="Activity_Service" targetRef="EndEvent_1" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="{{processId}}">
      <bpmndi:BPMNEdge id="Flow_3_di" bpmnElement="Flow_3">
        <di:waypoint x="530" y="117" />
        <di:waypoint x="592" y="117" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_2_di" bpmnElement="Flow_2">
        <di:waypoint x="370" y="117" />
        <di:waypoint x="430" y="117" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1_di" bpmnElement="Flow_1">
        <di:waypoint x="215" y="117" />
        <di:waypoint x="270" y="117" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="179" y="99" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="160" y="142" width="75" height="27" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_User_di" bpmnElement="Activity_User">
        <dc:Bounds x="270" y="77" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_Service_di" bpmnElement="Activity_Service">
        <dc:Bounds x="430" y="77" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_1_di" bpmnElement="EndEvent_1">
        <dc:Bounds x="592" y="99" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="581" y="142" width="59" height="27" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`, Ae = {
  generic: qt,
  "leave-approval": Se,
  "invoice-approval": Ie,
  "employee-onboarding": Be
}, Ce = document.getElementById("previewSection"), Pe = document.getElementById("initializerForm"), Ot = document.getElementById("projectName"), Pt = document.getElementById("groupId"), Et = document.getElementById("artifactId"), Ne = document.getElementById("javaPackage"), Ct = document.getElementById("submitBtn"), Wt = document.getElementById("globalError");
function Ht() {
  const j = Pt.value, d = Et.value.replace(/-/g, "").toLowerCase(), k = `${j}.${d}`;
  Ne.value = k;
}
Ht();
Nt();
const Dt = document.getElementById("fluxnovaVersion"), $t = document.getElementById("springBootVersion"), Gt = {
  "2.0.0": "3.4.4",
  "3.0.0": "4.0.5"
};
Dt.addEventListener("change", () => {
  $t.value = Gt[Dt.value];
});
$t.value = Gt[Dt.value];
Pe.addEventListener("submit", async (j) => {
  j.preventDefault(), Wt.textContent = "", document.querySelectorAll(".error").forEach((i) => i.style.display = "none");
  const O = {
    "2.0.0": "3.4.4",
    "3.0.0": "4.0.5"
  }, d = document.getElementById("fluxnovaVersion").value, k = {
    projectName: Ot.value.trim(),
    groupId: Pt.value.trim(),
    artifactId: Et.value.trim(),
    fluxnovaVersion: d,
    springBootVersion: O[d],
    javaVersion: "21",
    buildTool: "maven",
    database: document.querySelector('input[name="database"]:checked').value,
    adminUser: document.getElementById("adminUser").value.trim(),
    adminPassword: document.getElementById("adminPassword").value.trim(),
    bpmnTemplate: document.getElementById("bpmnTemplate").value,
    features: {
      cockpit: document.getElementById("feat-cockpit").checked,
      restApi: document.getElementById("feat-restApi").checked,
      docker: document.getElementById("feat-docker").checked
    }
  };
  let m = !1;
  if (["projectName", "groupId", "artifactId", "adminUser", "adminPassword"].forEach((i) => {
    k[i] || (console.warn(`[VALIDATION] Missing Required Field: ${i}`), document.getElementById(`err-${i}`).style.display = "inline", m = !0);
  }), m) {
    console.error("[VALIDATION] Form Validation Failed");
    return;
  }
  Ct.disabled = !0, Ct.textContent = "Generating...";
  try {
    await ze(k);
  } catch (i) {
    console.error("[GENERATION] Build Failed"), console.error(i), Wt.textContent = "Failed to generate project archive.";
  } finally {
    Ct.disabled = !1, Ct.textContent = "Generate Project";
  }
});
async function ze(j) {
  const { artifactId: O, features: d, database: k, bpmnTemplate: m } = j, i = O.replace(/-/g, "").toLowerCase(), s = `${j.groupId}.${i}`, n = s.replace(/\./g, "/"), g = `${O.split("-").map((S) => S.charAt(0).toUpperCase() + S.slice(1)).join("")}Application`, y = "SampleDelegate", _ = j.projectName.toLowerCase().replace(/\s+/g, "-"), b = {
    ...j,
    packageName: s,
    packagePath: n,
    mainClassName: g,
    delegateClassName: y,
    processId: _,
    isH2: k === "h2",
    isMysql: k === "mysql",
    isPostgresql: k === "postgresql",
    isSpring2: !1
  }, a = new te(), f = `${O}/`;
  a.file(
    `${f}pom.xml`,
    lt.render(_e, b)
  ), a.file(
    `${f}src/main/resources/application.yml`,
    lt.render(be, b)
  );
  const r = Ae[m] || qt;
  a.file(
    `${f}src/main/resources/processes/${_}.bpmn`,
    lt.render(r, b)
  );
  const u = `${f}src/main/java/${n}`;
  a.file(
    `${u}/${g}.java`,
    lt.render(ve, b)
  ), a.file(
    `${u}/delegate/${y}.java`,
    lt.render(ye, b)
  );
  const o = `${f}src/test/java/${n}`;
  a.file(
    `${o}/${g}Tests.java`,
    lt.render(we, b)
  ), d.docker && a.file(
    `${f}Dockerfile`,
    lt.render(ke, b)
  ), a.file(
    `${f}README.md`,
    lt.render(xe, b)
  ), a.file(
    `${f}.gitignore`,
    lt.render(Ee, b)
  );
  const p = await a.generateAsync({
    type: "blob"
  }), w = document.createElement("a");
  w.href = URL.createObjectURL(p), w.download = `${O}.zip`, document.body.appendChild(w), w.click(), document.body.removeChild(w);
}
function Te() {
  return {
    projectName: Ot.value.trim(),
    groupId: Pt.value.trim(),
    artifactId: Et.value.trim(),
    bpmnTemplate: document.getElementById("bpmnTemplate").value,
    features: {
      docker: document.getElementById("feat-docker").checked
    }
  };
}
function De(j) {
  const O = j.artifactId.replace(/-/g, "").toLowerCase(), k = `${j.groupId}.${O}`.replace(/\./g, "/"), m = j.projectName.toLowerCase().replace(/\s+/g, "-");
  return {
    name: `${j.artifactId || "workflow-engine"}/`,
    children: [
      {
        name: "pom.xml"
      },
      {
        name: "README.md"
      },
      {
        name: ".gitignore"
      },
      ...j.features.docker ? [{ name: "Dockerfile" }] : [],
      {
        name: "src/",
        children: [
          {
            name: "main/",
            children: [
              {
                name: "java/",
                children: [
                  {
                    name: `${k}/`,
                    children: [
                      {
                        name: `${j.artifactId.split("-").map((n) => n.charAt(0).toUpperCase() + n.slice(1)).join("")}Application.java`
                      },
                      {
                        name: "delegate/",
                        children: [
                          {
                            name: "SampleDelegate.java"
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                name: "resources/",
                children: [
                  {
                    name: "application.yml"
                  },
                  {
                    name: "processes/",
                    children: [
                      {
                        name: `${m || "process"}.bpmn`
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            name: "test/",
            children: [
              {
                name: "java/",
                children: [
                  {
                    name: `${k}/`,
                    children: [
                      {
                        name: `${j.artifactId.split("-").map((n) => n.charAt(0).toUpperCase() + n.slice(1)).join("")}ApplicationTests.java`
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };
}
function Vt(j, O = "", d = !0) {
  let k = O + (O ? d ? "└── " : "├── " : "") + j.name + `
`;
  if (j.children && j.children.length) {
    const m = O + (d ? "    " : "│   ");
    j.children.forEach((i, s) => {
      k += Vt(
        i,
        m,
        s === j.children.length - 1
      );
    });
  }
  return k;
}
function Nt() {
  const j = Te(), O = De(j), d = document.createElement("pre");
  d.className = "folder-tree", d.textContent = Vt(O), Ce.replaceChildren(d);
}
function Rt() {
  Ht(), Nt();
}
Ot.addEventListener("input", (j) => {
  Et.value = j.target.value.toLowerCase().replace(/\s+/g, "-"), Rt();
});
Pt.addEventListener(
  "input",
  Rt
);
Et.addEventListener(
  "input",
  Rt
);
document.getElementById("bpmnTemplate").addEventListener(
  "change",
  Nt
);
document.getElementById("feat-docker").addEventListener(
  "change",
  Nt
);
