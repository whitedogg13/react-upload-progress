import React from 'react';
import PropTypes from 'prop-types';

const UploadStatus = {
  IDLE: 0,
  SENDING: 1,
  DONE: 2,
  ERROR: 3,
};

class UploadObserver extends React.Component {
  static propTypes = {
    headers: PropTypes.object,
    method: PropTypes.oneOf(['post', 'put']),
    withCredentials: PropTypes.bool,
    url: PropTypes.string.isRequired,
    formData: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      status: UploadStatus.IDLE,
      done: 0,
      total: 0,
      response: null,
      error: null,
    };
  }

  componentDidMount() {
    let {
      headers = {},
      formData,
      url,
      method = 'post',
      withCredentials = false,
    } = this.props;

    this.setState({
      status: UploadStatus.SENDING,
    });

    xhrUpload({
      headers,
      formData,
      url,
      method,
      withCredentials,
      onProgress: () => 0,
      onUploadProgress: this._onUploadProgress,
      onDone: this._onDone,
      onError: this._onError,
    });
  }

  render() {
    return this.props.children({ ...this.state });
  }

  _onUploadProgress = ({ done, total }) => {
    this.setState({ done, total });
  };

  _onDone = response => {
    this.setState({
      status: UploadStatus.DONE,
      response,
    });
  };

  _onError = error => {
    this.setState({
      status: UploadStatus.ERROR,
      error,
    });
  };
}

function xhrUpload(
  {
    headers,
    formData,
    url,
    method,
    withCredentials,
    onProgress,
    onUploadProgress,
    onDone,
    onError,
  }
) {
  let xhr = new XMLHttpRequest();

  xhr.open(method, url, true);
  xhr.withCredentials = withCredentials;

  Object.keys(headers).forEach(key => {
    xhr.setRequestHeader(key, headers[key]);
  });

  xhr.addEventListener(
    'progress',
    e => {
      let done = e.position || e.loaded;
      let total = e.totalSize || e.total;
      onProgress && onProgress({ done, total });
    },
    false
  );

  xhr.addEventListener('error', e => {
    onError && onError(e);
  });

  if (xhr.upload) {
    xhr.upload.onprogress = e => {
      let done = e.position || e.loaded;
      let total = e.totalSize || e.total;
      onUploadProgress && onUploadProgress({ done, total });
    };
  }

  xhr.onreadystatechange = function(e) {
    if (4 == this.readyState) {
      onDone &&
        onDone({
          type: xhr.responseType || 'text',
          data: xhr.response,
        });
    }
  };

  xhr.send(formData);
}

export default UploadObserver;

export { UploadStatus };
