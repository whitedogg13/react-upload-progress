# react-upload-progress

React component to observe file upload / form post progress using render props, with maximum flexibility!

## Concept 

1. Handle most of the tedious xhr stuff for you
2. You will have full control for the UI part, thanks to render props pattern
3. You can still customize the xhr detail, wuch as headers, withCredentials, and the data to send

## Usage

```javascript
import UploadProgress, {UploadStatus} from 'react-upload-progress';

<UploadProgress
  url={YOUR_UPLOAD_URL}
  formData={formData}
>
  {({ status, done, total, error, response }) => (
    <div>
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
```

## Examples

Full examples can be found in `examples` directory

