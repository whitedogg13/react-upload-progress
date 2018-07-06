'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UploadStatus = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UploadStatus = {
  IDLE: 0,
  SENDING: 1,
  DONE: 2,
  ERROR: 3
};

var UploadObserver = function (_React$Component) {
  _inherits(UploadObserver, _React$Component);

  function UploadObserver(props) {
    _classCallCheck(this, UploadObserver);

    var _this = _possibleConstructorReturn(this, (UploadObserver.__proto__ || Object.getPrototypeOf(UploadObserver)).call(this, props));

    _this._onUploadProgress = function (_ref) {
      var done = _ref.done,
          total = _ref.total;

      _this.setState({ done: done, total: total });
    };

    _this._onDone = function (response) {
      _this.setState({
        status: UploadStatus.DONE,
        response: response
      });
    };

    _this._onError = function (error) {
      _this.setState({
        status: UploadStatus.ERROR,
        error: error
      });
    };

    _this.state = {
      status: UploadStatus.IDLE,
      done: 0,
      total: 0,
      response: null,
      error: null
    };
    return _this;
  }

  _createClass(UploadObserver, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props = this.props,
          _props$headers = _props.headers,
          headers = _props$headers === undefined ? {} : _props$headers,
          formData = _props.formData,
          url = _props.url,
          _props$method = _props.method,
          method = _props$method === undefined ? 'post' : _props$method,
          _props$withCredential = _props.withCredentials,
          withCredentials = _props$withCredential === undefined ? false : _props$withCredential;


      this.setState({
        status: UploadStatus.SENDING
      });

      xhrUpload({
        headers: headers,
        formData: formData,
        url: url,
        method: method,
        withCredentials: withCredentials,
        onProgress: function onProgress() {
          return 0;
        },
        onUploadProgress: this._onUploadProgress,
        onDone: this._onDone,
        onError: this._onError
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.children(_extends({}, this.state));
    }
  }]);

  return UploadObserver;
}(_react2.default.Component);

UploadObserver.propTypes = {
  headers: _propTypes2.default.object,
  method: _propTypes2.default.oneOf(['post', 'put']),
  withCredentials: _propTypes2.default.bool,
  url: _propTypes2.default.string.isRequired,
  formData: _propTypes2.default.object.isRequired
};


function xhrUpload(_ref2) {
  var headers = _ref2.headers,
      formData = _ref2.formData,
      url = _ref2.url,
      method = _ref2.method,
      withCredentials = _ref2.withCredentials,
      onProgress = _ref2.onProgress,
      onUploadProgress = _ref2.onUploadProgress,
      onDone = _ref2.onDone,
      onError = _ref2.onError;

  var xhr = new XMLHttpRequest();

  xhr.open(method, url, true);
  xhr.withCredentials = withCredentials;

  Object.keys(headers).forEach(function (key) {
    xhr.setRequestHeader(key, headers[key]);
  });

  xhr.addEventListener('progress', function (e) {
    var done = e.position || e.loaded;
    var total = e.totalSize || e.total;
    onProgress && onProgress({ done: done, total: total });
  }, false);

  xhr.addEventListener('error', function (e) {
    onError && onError(e);
  });

  if (xhr.upload) {
    xhr.upload.onprogress = function (e) {
      var done = e.position || e.loaded;
      var total = e.totalSize || e.total;
      onUploadProgress && onUploadProgress({ done: done, total: total });
    };
  }

  xhr.onreadystatechange = function (e) {
    if (4 == this.readyState) {
      onDone && onDone({
        statusCode: xhr.status,
        type: xhr.responseType || 'text',
        data: xhr.response
      });
    }
  };

  xhr.send(formData);
}

exports.default = UploadObserver;
exports.UploadStatus = UploadStatus;