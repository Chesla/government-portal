import { createMuiTheme } from "@material-ui/core/styles";
export const theme = createMuiTheme({
    overrides: {
      // Style sheet name ⚛️
      MuiButton: {
        text: {
          color: "#76C043"
        },
        contained: {
          backgroundColor: "#76C043",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#76C043",
            color: "#ffffff"
          }
        }
      },
      MuiTextField: {
        root : {
            width: '100%',
        }
      },
      MuiCheckbox: {
        colorPrimary: {
          color: "black",
          "&$checked": {
            color: "#017ACD"
          }
        },
        root: {
          color: "black",
          "&$checked": {
            color: "#017ACD"
          }
        }
      },
      MuiFormLabel: {
        root: {
          color: "rgb(4, 31, 65)"
        }
      },
      MuiFormControlLabel: {
        label: {
          color: "rgb(4, 31, 65)"
        }
      },
      MuiOutlinedInput: {
        root: {
          "&$focused": {
            borderColor: "green"
          }
        }
      },
      MuiDialogTitle: {
        root: {
          background: "white",
          zIndex: "1"
        }
      },
      MuiDialogContent: {
        root: {
          paddingTop: "0px"
        }
      },
      MuiPaper: {
        root: {
          color: "rgb(4, 31, 65)"
        }
      },
      MuiFormControl: {
        root: {
          "&$focused": {
            color: "rgb(4, 31, 65)",
            backgroundColor:"white"
          },
          width: '100%',
        },
        marginNormal: {
          marginTop: "3px",
          marginBottom: "8px"
        }
      },
      MuiSelect: {
        select: {
            "&:focus": {
              color: "rgb(4, 31, 65)",
              backgroundColor:"white"
            }
        },
        outlined:{
          textAlign: "left"
        }
      },

      
    }
  });