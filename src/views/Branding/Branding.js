import React, { Component } from "react";
import {connect} from "react-redux";
// import Header from "../../components/Header/Header";
// import HeaderLinks from "../../components/Header/HeaderLinks";
import { logOut, getAgeGenderInterests, saveBrands } from "../../actions";
import image from "../../assets/img/dg1.jpg";
import './style.css'
import {withStyles} from "@material-ui/core";
import basicsStyle from "../../assets/jss/material-kit-pro-react/views/signupPageStyle";
//import basicsStyle from "../../assets/jss/material-kit-pro-react/views/componentsSections/basicsStyle.js";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import Card from "../../components/Card/Card";
import CardBody from "../../components/Card/CardBody";
import CircularProgress from "@material-ui/core/CircularProgress";
import CustomInput from "../../components/CustomInput/CustomInput";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Button from "../../components/CustomButtons/Button";
import {Redirect} from "react-router-dom";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {FiberManualRecord} from "@material-ui/icons";
import Radio from "@material-ui/core/Radio";
import NewNavbar from "components/NewNavbar";


class Branding extends Component{

    constructor(props){
        super(props);

        this.state = {
            selectedEnabled: 0,
            branding: '',
            brands: [{
                ages: [], gender: '', interests: [], brandName: ''
            }],
            mind: false
        }
    }
    

    componentDidMount() {
        this.props.getAgeGenderInterests();
    }

    renderBrandingComponent(){
        const { classes, interestsArray, agesArray, gendersArray } = this.props;
        const {  brands, selectedEnabled  } = this.state;
        if (brands){
            return brands.map((brand, index) => {
                const { ages, gender, interests, brandName } = brand;
                return(
                    <Card>
                        <CardBody>
                            <GridContainer key={index}>
                                <GridItem xs={12} md={12} sm={12}>
                                    <GridContainer>
                                        <GridItem sm={2} md={2} lg={2}>
                                            <div
                                                style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30}}
                                                className={
                                                    classes.checkboxAndRadio +
                                                    " " +
                                                    classes.checkboxAndRadioHorizontal
                                                }
                                            >
                                                <FormControlLabel
                                                    control={
                                                        <Radio
                                                            checked={selectedEnabled === index}
                                                            onChange={() => this.setState({selectedEnabled: index})}
                                                            value="a"
                                                            name="radio button enabled"
                                                            aria-label="A"
                                                            icon={
                                                                <FiberManualRecord className={classes.radioUnchecked} />
                                                            }
                                                            checkedIcon={
                                                                <FiberManualRecord className={classes.radioChecked} />
                                                            }
                                                            classes={{
                                                                checked: classes.radio,
                                                                root: classes.radioRoot
                                                            }}
                                                        />
                                                    }
                                                    classes={{
                                                        label: classes.label,
                                                        root: classes.labelRoot
                                                    }}
                                                />
                                            </div>
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={6}>
                                            <CustomInput
                                                formControlProps={{
                                                    fullWidth: true,
                                                    className: classes.customFormControlClasses
                                                }}
                                                value={brandName}
                                                inputProps={{
                                                    type: "text",
                                                    onChange: (e) => {
                                                        this.handleInputChange(e.target.value, index, brands, 'brandname')
                                                    },
                                                    placeholder: "Brand Name..."
                                                }}
                                            />
                                        </GridItem>
                                        <GridItem xs={12} md={4}>
                                            <FormControl style={{ marginTop: 10}} fullWidth className={classes.selectFormControl}>
                                                <InputLabel
                                                    htmlFor="simple-select"
                                                    className={classes.selectLabel}
                                                >
                                                    Age (choose 2)
                                                </InputLabel>
                                                <Select
                                                    multiple
                                                    value={ages}
                                                    onChange={(e) => this.handleInputChange(e.target.value, index, brands, 'ages')}
                                                    MenuProps={{
                                                        className: classes.selectMenu,
                                                        classes: { paper: classes.selectPaper }
                                                    }}
                                                    classes={{ select: classes.select }}
                                                    inputProps={{
                                                        name: "multipleSelect",
                                                        id: "multiple-select"
                                                    }}
                                                >
                                                    {agesArray && (
                                                        agesArray.map((item, index) => {
                                                            return(
                                                                <MenuItem
                                                                    key={index}
                                                                    classes={{
                                                                        root: classes.selectMenuItem,
                                                                        selected: classes.selectMenuItemSelectedMultiple
                                                                    }}
                                                                    value={item.id}
                                                                >
                                                                    {`${item.min || ''} - ${item.max || ''}`}
                                                                </MenuItem>
                                                            )
                                                        })
                                                    )}
                                                </Select>
                                            </FormControl>
                                        </GridItem>
                                    </GridContainer>
                                    <GridContainer>
                                        <GridItem sm={2} md={2} lg={2} />
                                        <GridItem xs={12} md={6}>
                                            <FormControl fullWidth className={classes.selectFormControl}>
                                                <InputLabel
                                                    htmlFor="simple-select"
                                                    className={classes.selectLabel}
                                                >
                                                    Select Interests (choose 2)
                                                </InputLabel>
                                                <Select
                                                    multiple
                                                    value={interests}
                                                    onChange={(e) => this.handleInputChange(e.target.value, index, brands, 'interests')}
                                                    MenuProps={{
                                                        className: classes.selectMenu,
                                                        classes: { paper: classes.selectPaper }
                                                    }}
                                                    classes={{ select: classes.select }}
                                                    inputProps={{
                                                        name: "multipleSelect",
                                                        id: "multiple-select"
                                                    }}
                                                >
                                                    {interestsArray && (
                                                        interestsArray.map((item, index) => {
                                                            return(
                                                                <MenuItem
                                                                    key={index}
                                                                    classes={{
                                                                        root: classes.selectMenuItem,
                                                                        selected: classes.selectMenuItemSelectedMultiple
                                                                    }}
                                                                    value={item.id}
                                                                >
                                                                    {item.description || ''}
                                                                </MenuItem>
                                                            )
                                                        })
                                                    )}
                                                </Select>
                                            </FormControl>
                                        </GridItem>
                                        <GridItem xs={12} md={4}>
                                            <FormControl fullWidth className={classes.selectFormControl}>
                                                <InputLabel
                                                    htmlFor="simple-select"
                                                    className={classes.selectLabel}
                                                >
                                                    Gender
                                                </InputLabel>
                                                <Select
                                                    MenuProps={{
                                                        className: classes.selectMenu
                                                    }}
                                                    classes={{
                                                        select: classes.select
                                                    }}
                                                    value={gender}
                                                    onChange={(e) => this.handleInputChange(e.target.value, index, brands, 'gender')}
                                                    inputProps={{
                                                        name: "simpleSelect",
                                                        id: "simple-select"
                                                    }}
                                                >
                                                    {gendersArray && (
                                                        gendersArray.map((item, index) => {
                                                            return(
                                                                <MenuItem
                                                                    key={index}
                                                                    classes={{
                                                                        root: classes.selectMenuItem,
                                                                        selected: classes.selectMenuItemSelected
                                                                    }}
                                                                    value={item.id}
                                                                >
                                                                    {item.description || ''}
                                                                </MenuItem>
                                                            )
                                                        })
                                                    )}
                                                </Select>
                                            </FormControl>
                                        </GridItem>
                                    </GridContainer>
                                </GridItem>
                            </GridContainer>
                        </CardBody>
                    </Card>
                )
            })
        }
    }

    handleInputChange(value, ind, brands, input){
        const arr = brands.map((brand, index) => {
            if (ind === index){
                if (input === 'brandname')
                    return { ...brand, brandName: value};
                else if (input === 'ages' && value.length <= 2)
                    return { ...brand, ages: value};
                else if (input === 'interests' && value.length <= 2)
                    return { ...brand, interests: value};
                else if (input === 'gender')
                    return { ...brand, gender: value};
            }
            return brand
        });
        this.setState({ brands: arr });
    }

    handleBrandSelectionChange(value){
        if (value === 'single')
            this.setState({branding: value, brands: [{ages: [], gender: '', interests: [], brandName: ''}]});
        else{
            this.setState({branding: value })
        }
    }

    removeBrand() {
        let array = [...this.state.brands]; // make a separate copy of the array
        array.splice(array.length - 1, 1);
        this.setState({brands: array });
    }

    handleSaveBrands(brands, branding){
        const { interestsArray, agesArray, gendersArray, saveBrands } = this.props;
        const { selectedEnabled, mind } = this.state;
        const newArray = brands.map((brand => {
            return {
                ...brand,
                ages: brand.ages.map(age => {
                    return this.findItem(agesArray, age);
                }),
                interests: brand.interests.map(interest => {
                    return this.findItem(interestsArray, interest);
                }),
                gender: this.findItem(gendersArray, brand.gender),
            }
        }));
        saveBrands(newArray, branding, selectedEnabled);
        this.setState({
            mind: true,
        })
    }

    if (mind) {
        return <Redirect exact to={{ pathname: "/" }} />;
      }



    findItem(array = [], item){
        for (let i = 0; i < array.length; i++){
            if (array[i].id === item){
                delete array[i].created_by; //delete this key from object so that we dont have to store so much on the user document in firrebasse
                return array[i];
            }
        }
        return undefined;
    }


    render() {
        const { isAuthenticated, user , logOut, classes, loading, success, saveBrands } = this.props;
        const { branding , brands} = this.state;

        if (!isAuthenticated ) {
            return (
                <Redirect to="/" />
            )   
        }

        if (success){
            return (
                <Redirect to="/" />
            )
        }


        return(

            <div>
                <NewNavbar  isAuthenticated={isAuthenticated} user={user} logOutUser={() => logOut()} />
                <div
                    className="brando"
                >
                    <div className={classes.container}>
                        <GridContainer justify="center">
                            <GridItem xs={12} sm={12} md={12}>
                                <Card className={classes.cardSignup}>
                                    <h2 className={classes.cardTitle}>Branding</h2>
                                    <CardBody>
                                        <GridContainer justify="center">
                                            <GridItem xs={12} sm={12} md={12}>
                                                <form className={classes.form}>
                                                    <GridContainer>
                                                        <GridItem sm={2} md={2} lg={2} />
                                                        <GridItem xs={12} sm={4} md={4} lg={3}>
                                                            <FormControl fullWidth className={classes.selectFormControl}>
                                                                <InputLabel
                                                                    htmlFor="simple-select"
                                                                    className={classes.selectLabel}
                                                                >
                                                                    Select Branding Type
                                                                </InputLabel>
                                                                <Select
                                                                    MenuProps={{
                                                                        className: classes.selectMenu
                                                                    }}
                                                                    classes={{
                                                                        select: classes.select
                                                                    }}
                                                                    value={branding}
                                                                    onChange={(e) =>  this.handleBrandSelectionChange(e.target.value)}
                                                                    inputProps={{
                                                                        name: "simpleSelect",
                                                                        id: "simple-select"
                                                                    }}
                                                                >

                                                                    <MenuItem
                                                                        classes={{
                                                                            root: classes.selectMenuItem,
                                                                            selected: classes.selectMenuItemSelected
                                                                        }}
                                                                        value="single"
                                                                    >
                                                                        Single Branding
                                                                    </MenuItem>
                                                                    <MenuItem
                                                                        classes={{
                                                                            root: classes.selectMenuItem,
                                                                            selected: classes.selectMenuItemSelected
                                                                        }}
                                                                        value="multi"
                                                                    >
                                                                        Multiple Branding
                                                                    </MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                        </GridItem>
                                                    </GridContainer>
                                                    {this.renderBrandingComponent()}
                                                </form>
                                                {loading &&
                                                <div className={classes.textCenter} style={{ marginTop: 20, marginBottom: 20}}>
                                                    <CircularProgress />
                                                </div>
                                                }
                                                <div className="brand_btn" style={{ marginTop: 20, marginBottom: 20}}>
                                                    <Button color="success"  round onClick={() => this.handleSaveBrands(brands, branding)}>
                                                        Save
                                                    </Button>
                                                    {branding === 'multi' &&
                                                    <Button color="primary"  round onClick={() => this.setState({ brands: [...brands, {ages: [], gender: '', interests: [], brandName: ''}]})}>
                                                        Add MORE...
                                                    </Button>
                                                    }
                                                    {brands.length > 1 &&
                                                    <Button color="danger"  round onClick={() => this.removeBrand()}>
                                                        REMOVE
                                                    </Button>
                                                    }
                                                </div>
                                            </GridItem>
                                        </GridContainer>
                                    </CardBody>
                                </Card>
                            </GridItem>
                        </GridContainer>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({ login, branding }) => {
    const { loading, error, agesArray, gendersArray, interestsArray, success } = branding;
    const { isAuthenticated, user } = login;
    return { loading, error , isAuthenticated, user, agesArray, gendersArray, interestsArray , success };
};


export default connect(mapStateToProps, {
    logOut, getAgeGenderInterests, saveBrands
})(withStyles(basicsStyle)(Branding));