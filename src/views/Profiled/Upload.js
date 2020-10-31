import React, { useState } from "react";
import { Storage } from "../../firebase";
import firebase from "firebase/app";
import { Button } from "@material-ui/core";
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
//add import for storage
function Upload({ order }) {
  // console.log(order, "ORDER")
  const allInputs = { imgUrl: "" };
  const [imageAsFile, setImageAsFile] = useState(null);
  const [uploadStart, setUploadStart] = useState(false)
  const [imageAsUrl, setImageAsUrl] = useState(allInputs);
  const [progress, setProgress] = useState(0)
  // console.log(imageAsFile);
  const handleImageAsFile = (e) => {
    const image = e.target.files[0];
    setImageAsFile((imageFile) => image);
    console.log(image)
  };
  const handleFireBaseUpload = (e) => {
    e.preventDefault();
    console.log("start of upload");
    setUploadStart(true)
    // async magic goes here...
    if (imageAsFile === "") {
      console.error(`not an image, the image file is a ${typeof imageAsFile}`);
    }
    const uploadTask = firebase.storage()
      .ref(`/cheque/${order.campaignTitle}`)
      .put(imageAsFile);
    //initiates the firebase side uploading
    uploadTask.on(
      "state_changed",
      (snapShot) => {
        //takes a snap shot of the process as it is happening
        let getProgress =
          (snapShot.bytesTransferred / snapShot.totalBytes) * 100;
        setProgress(getProgress)
        // console.log(snapShot);
      },
      (err) => {
        //catches the errors
        console.log(err);
      },
      () => {
        // gets the functions from storage refences the image storage in firebase by the children
        // gets the download url then sets the image from firebase as the value for the imgUrl key:
        firebase.storage()
          .ref("cheque")
          .child(order.campaignTitle)
          .getDownloadURL()
          .then((fireBaseUrl) => {
            setImageAsUrl((prevObject) => ({
              ...prevObject,
              imgUrl: fireBaseUrl,
            }));
            // console.log(fireBaseUrl);
            sendToServer(fireBaseUrl)
          });
      }
    );
  };



  function CircularProgressWithLabel(props) {
    return (
      <Box position="relative" display="inline-flex">
        <CircularProgress variant="static" {...props} />
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
            props.value,
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }

  CircularProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate and static variants.
     * Value between 0 and 100.
     */
    value: PropTypes.number.isRequired,
  };



  const sendToServer = async (link) => {
    // console.log(order, "PAYSTACK");
    const payload = {
      id: order.id,
      email: order.user.email,
      campaignTitle: order.campaignTitle,
      link
    }
    // "https://adspace-node.herokuapp.com/api/v1/payment/email"
    const response = await fetch(
      "/api/v1/payment/email",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    // console.log(response.json());
    const res = await response.json();
    // console.log(res)
    if (res.status === "success") {
      window.location.reload()
    }

  };
  const hiddenFileInput = React.useRef(null);

  const handleClick = event => {
    hiddenFileInput.current.click();
  };

  return (
    <div className="App">
      {uploadStart ? (<CircularProgressWithLabel value={progress} />) : (
        <form onSubmit={handleFireBaseUpload}>
          <input className='btn' type="file" ref={hiddenFileInput} onChange={handleImageAsFile} style={{ display: 'none' }} />
          <p>{imageAsFile ? imageAsFile.name : ""}</p>
          {!imageAsFile ? (<Button onClick={handleClick} style={{ backgroundColor: "#0b28ba", color: '#fff' }}>Upload</Button>) : (<Button onClick={handleFireBaseUpload} style={{ color: '#fff' }} variant="contained" color="primary">Send</Button>)}
        </form>)}
      {/* <img src={imageAsUrl.imgUrl} alt="image tag" /> */}
      {/* <a href={imageAsUrl.imgUrl}>downlod</a> */}
    </div>
  );
}

export default Upload;