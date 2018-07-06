import React, { Component } from 'react';
import './App.css';
import UploadProgress, {UploadStatus} from 'react-upload-progress';

const YOUR_UPLOAD_URL = 'http://localhost:8000/api/user/upload/'; 

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: null,
      uploading: false,
    }
  }

  render() {
    let {formData, uploading} = this.state;

    return (
      <div className="App">
        <h1>React Upload Progress Demo</h1>
        <input type='file' onChange={this._setFormData} /><br />
        <button onClick={this._onUploadClick}>upload</button><br />

        {uploading && (
          <UploadProgress
            url={YOUR_UPLOAD_URL}
            formData={formData}
          >
            {({ status, done, total, error, response }) => (
              <div style={{padding: 10, border: '1px solid #ccc', width: 300, margin: '0 auto'}}>
                {status === UploadStatus.IDLE && (
                  <h2>Not started</h2>
                )}

                {status === UploadStatus.SENDING && (
                  <div>
                    <h2>Uploading</h2>
                    <h3>{`${done} / ${total}`}</h3>
                  </div>
                )}

                {status === UploadStatus.DONE && (
                  <div>
                    <h2>Done</h2>
                    <h3>{JSON.stringify(response)}</h3>
                    <button onClick={() => this.setState({uploading: false})}>OK</button>
                  </div>
                )}

                {status === UploadStatus.ERROR && (
                  <div>
                    <h2>Error</h2>
                    <h3>{JSON.stringify(error)}</h3>
                    <button onClick={() => this.setState({uploading: false})}>OK</button>
                  </div>
                )}
              </div>
            )}
          </UploadProgress>
        )}
      </div>
    );
  }

  _setFormData = e => {
    let formData = new FormData();
    formData.append('file', e.target.files[0]);
    formData.append('name', 'some-string');
    this.setState({ formData });
  }

  _onUploadClick = () => {
    let {formData} = this.state;
    if (formData) {
      this.setState({ uploading: true });
    }
  }
}

export default App;
