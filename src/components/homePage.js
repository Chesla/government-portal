/* eslint-disable complexity */
import React, { useState } from "react";
import { ThemeProvider} from '@material-ui/core/styles';
import {Alert} from "@material-ui/lab";
import { Card,
    CardHeader,
    CardContent,
    Grid,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    CircularProgress,
    InputAdornment,
    IconButton,
    OutlinedInput,
    Box,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
    FormHelperText } from "@material-ui/core";
import {theme} from "../constants";
import firebase from "../firebase";
import FileCopyIcon from '@material-ui/icons/FileCopy';
const mobileregex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
const emailregex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const usernameregex = /^(?=[a-zA-Z0-9._]{2,25}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
let callback = null;
const HomePage = () => {
    const roles = ["issuer", "holder", "verifier"];
    const agents = ["medical", "school", "business", "person"];
    const [itemData, setItemData] = useState({
        username: "",
        mobilenumber: "",
        emailid: "",
        otp: "",
        DID: "",
        agent:"",
    });
    const [itemDataError, setItemDataError] = useState({
        username: false,
        mobilenumber: false,
        emailid: false,
        otp: false,
        roles: false,
        agent:false
    });
    const [showOtpDialog, setOtpDialogView] = useState(false);
    const [showOtpSection, setOtpOTPView] = useState(false);
    const [showLoader, setLoader] = useState(false);
    const [loaderText, setLoaderText] = useState("");
    const [successMessage, setSuccessmessage] = useState(false);
    const [failureMessage, setFailuremessage] = useState(false);
    const [rolesSelected, setSelectedRoles] = React.useState([]);
    const setRoles = (event) => {
        setSelectedRoles(event.target.value);
    };
    const saveInfo = (e) => {
        if(e.target.value.trim() === ""){
            setItemData({...itemData, ...{[e.target.name]: e.target.value}});
            setItemDataError({...itemDataError, ...{[e.target.name]: true}});
        }
        if(e.target.name === "mobilenumber"){
            if (!isNaN(e.target.value) && e.target.value.length <= 10){
                setItemData({...itemData, ...{[e.target.name]: e.target.value}});
                if(e.target.value.match(mobileregex) && ! (e.target.value.match(/0{5,}/))){
                    setItemDataError({...itemDataError, ...{[e.target.name]: false}});
                }else{
                    setItemDataError({...itemDataError, ...{[e.target.name]: true}});
                }
            }
        }
        if(e.target.name === "emailid"){
            setItemData({...itemData, ...{[e.target.name]: e.target.value}});
            if(e.target.value.match(emailregex)){
                setItemDataError({...itemDataError, ...{[e.target.name]: false}});
            }else{
                setItemDataError({...itemDataError, ...{[e.target.name]: true}});
            }
        }
        if(e.target.name === "username"){
            setItemData({...itemData, ...{[e.target.name]: e.target.value}});
            if(e.target.value.match(usernameregex)){
                setItemDataError({...itemDataError, ...{[e.target.name]: false}});
            }else{
                setItemDataError({...itemDataError, ...{[e.target.name]: true}});
            }
        }
        if(e.target.name === "otp"){
            if(!isNaN(e.target.value) && e.target.value.length<=6){
                setItemData({...itemData, ...{[e.target.name]: e.target.value}});
                setItemDataError({...itemDataError, ...{[e.target.name]: false}});
            }
        }
        if(e.target.name === "agent"){
            if(e.target.value.length){
                setItemData({...itemData, ...{[e.target.name]: e.target.value}});
                setItemDataError({...itemDataError, ...{[e.target.name]: false}});
            }
        }
    }
    const getOtp = () => {
        if(!itemData.mobilenumber || !itemData.emailid || !itemData.username || rolesSelected.length === 0){
            let errorObj  = {
                ...itemDataError,
                mobilenumber: !itemData.mobilenumber ,
                emailid: !itemData.emailid,
                username: !itemData.username,
                roles: rolesSelected.length === 0
            }
            setItemDataError(errorObj);
        }else{
            setOtpDialogView(true);
            setOtpOTPView(false);
            setItemData({...itemData, ...{"otp": ""}});
        }
        
    }
    const registerAccount = () => {
        let param = {
            username: itemData.username,
            mobilenumber: itemData.mobilenumber,
            emailid: itemData.emailid
        };
        setTimeout(()=>{
            setSuccessmessage("Account is successfully Registered");
            setItemData({...itemData, ...{"DID": "YAVHHJEMSMD"}});
            setLoader(false);
        })
    }
    const verifyOtp  = () => {
        if(itemData.otp === null) return;
        setLoader(true);
        callback.confirm(itemData.otp).then(function (result) {
            setSuccessmessage("Account is verified");
            setLoaderText("Please wait till registartion is completed....");
            setLoader(true);
            registerAccount();
        }).catch(function (error) {
            console.error( error);
            setLoader(false);
            setFailuremessage("Some error occured");
        });
    }
    const sendOtp = () => {
        setOtpDialogView(false);
        let recaptcha = new firebase.auth.RecaptchaVerifier('recaptcha');
        let number = "+91"+itemData.mobilenumber;
        firebase.auth().signInWithPhoneNumber(number, recaptcha).then( function(e) {
            callback = e;
            setOtpOTPView(true);
            document.getElementById("recaptcha").innerHTML = "";
        })
        .catch(function (error) {
            console.error( "error",error);
            setFailuremessage("Some error occured");
        });
    }
    const checkParam = () => {
        if(itemDataError.username || itemDataError.mobilenumber || itemDataError.emailid || itemDataError.agent
            || !itemData.mobilenumber || !itemData.emailid || !itemData.username || rolesSelected.length === 0 || !itemData.agent){
                return true;
        }
        return false;
    }
    const copyToClipboard = () => {
        let copyText = document.getElementById("DID");
        copyText.select();
        copyText.setSelectionRange(0, 99999)
        document.execCommand("copy");
        setSuccessmessage("Copied to clipboard")
        window.setTimeout(()=>{
            setSuccessmessage("");
        },2000);
    }
    return (
        <ThemeProvider theme={theme}>
            <Box>
                {showLoader ? 
                <div className={"loader-parent"}>
                    <div className={"loader-container"}>
                        <CircularProgress size={50} left={0} top={0} />
                    </div>
                    <div>
                        {loaderText}
                    </div>
                </div>
                : null}
                {successMessage && 
                <Alert severity="success">
                    {successMessage}
                </Alert> }
                {failureMessage && 
                <Alert severity="error">
                    {failureMessage}
                </Alert> }
                <Card className={"mgTop10"}>
                <CardHeader title="Self Registration Portal" />
                <CardContent>
                        <Grid
                        style={{width:"320px", margin:"0 auto"}}
                        container
                        alignItems={"center"}
                        spacing={2}
                        >
                        <Grid item xs={12} md={12}>
                            <TextField
                                label="User Name"
                                id="username"
                                name="username"
                                value={itemData.username}
                                error={itemDataError.username}
                                helperText={itemDataError.username ? "Please enter a valid user name." : ""}
                                variant="outlined"
                                onChange={saveInfo}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <FormControl variant="outlined">
                                <InputLabel id="demo-simple-select-outlined-label">Role</InputLabel>
                                <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={rolesSelected||[]}
                                multiple
                                onChange={setRoles}
                                renderValue={(selected) => selected.join(', ').toUpperCase()}
                                label="Role"
                                >
                                {roles.map((role) => (
                                    <MenuItem key={role} value={role}>
                                        <Checkbox color="primary" checked={rolesSelected.indexOf(role) > -1} />
                                        <ListItemText primary={role.toUpperCase()} />
                                    </MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                            {itemDataError.role ?
                                <FormHelperText>Please select atleast a role.</FormHelperText>
                            :null}
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <FormControl variant="outlined">
                                <InputLabel id="agent-simple-select-outlined-label">Agent Type</InputLabel>
                                <Select
                                labelId="agent-simple-select-outlined-label"
                                id="agent"
                                name="agent"
                                value={itemData.agent||""}
                                onChange={saveInfo}
                                label="Agent Type"
                                >
                                {agents.map((a) => (
                                    <MenuItem key={a} value={a}>
                                        {(a||"").toUpperCase()}
                                    </MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                            {itemDataError.agent ?
                                <FormHelperText>Please select the agent type.</FormHelperText>
                            :null}
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <TextField
                                label="Mobile Number"
                                id="mobilenumber"
                                name="mobilenumber"
                                value={itemData.mobilenumber}
                                error={itemDataError.mobilenumber}
                                helperText={itemDataError.mobilenumber ? "Please enter a valid mobile number." : ""}
                                variant="outlined"
                                onChange={saveInfo}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <TextField
                                label="Email Id"
                                id="emailid"
                                name="emailid"
                                value={itemData.emailid}
                                error={itemDataError.emailid}
                                helperText={itemDataError.emailid ? "Please enter a valid email id." : ""}
                                variant="outlined"
                                onChange={saveInfo}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Button variant="contained"
                                disabled={checkParam()}
                                onClick={getOtp}>
                                GET OTP
                            </Button>
                        </Grid>
                        <Grid  item xs={12} md={12}>
                            <div id="recaptcha"></div>
                        </Grid>
                        {showOtpSection ?
                        <React.Fragment>
                            <Grid item xs={12} md={12}>
                                <TextField
                                    label="OTP"
                                    id="otp"
                                    name="otp"
                                    autoComplete={"off"}
                                    value={itemData.otp}
                                    error={itemDataError.otp}
                                    helperText={itemDataError.emailid ? "Please enter a valid otp." : ""}
                                    variant="outlined"
                                    onChange={saveInfo}
                                />
                            </Grid>
                            
                            <Grid item xs={12} md={12}>
                                <Button variant="contained"
                                    onClick={verifyOtp}>
                                    Verify OTP & Register
                                </Button>
                            </Grid>
                            {itemData.DID ?
                            <Grid item xs={12} md={12}>
                                <OutlinedInput
                                    label="DID"
                                    id="DID"
                                    name="DID"
                                    value={itemData.DID}
                                    variant="outlined"
                                    endAdornment={
                                        <InputAdornment position="end">
                                          <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={copyToClipboard}
                                          >
                                            <FileCopyIcon />
                                          </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </Grid>
                            :null}
                            
                        </React.Fragment>
                        : null}
                    </Grid>
                    <Dialog
                        open={showOtpDialog}
                        onClose={() => setOtpDialogView(false)}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                <div>
                                    OTP will be sent to your mobile number <b>{itemData.mobilenumber}</b>.
                                    Please verify captcha to receive your OTP.
                                </div>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                        <Button variant="contained"
                            onClick={() => setOtpDialogView(false)}>
                            Cancel
                        </Button>
                        <Button variant="contained"
                            onClick={sendOtp} autoFocus>
                            Confirm
                        </Button>
                        </DialogActions>
                    </Dialog>
                </CardContent>
            </Card>
            </Box>
        </ThemeProvider>
    );
};

export default HomePage;


