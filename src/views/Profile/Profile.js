import React, { Component } from "react";
import { connect } from "react-redux";
import Header from "../../components/Header/Header";
import HeaderLinks from "../../components/Header/HeaderLinks";
import {
    logOut, setAuthenticated, editProfile, profileNameChange, profileSubscribeChange, getUser, displayProfileMessage,
    saveProfile, getUserOrders, getAgeGenderInterests, saveBrandsProfile, changeSelectedBrand, removeBrand,
    deleteAccount
} from "../../actions";
import shoppingCartStyle from "../../assets/jss/material-kit-pro-react/views/shoppingCartStyle.js";
import { CircularProgress, DialogContent, LinearProgress, withStyles } from "@material-ui/core";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import Card from "../../components/Card/Card";
import CardBody from "../../components/Card/CardBody";
import { getAuth } from "../../firebase";
import CustomInput from "../../components/CustomInput/CustomInput";
import Checkbox from "@material-ui/core/Checkbox";
import { Add, Check, Close, FiberManualRecord, KeyboardArrowRight, Remove } from "@material-ui/icons";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "../../components/CustomButtons/Button";
import { grayColor } from "../../assets/jss/material-kit-pro-react";
import Badge from "../../components/Badge/Badge";
import { Redirect } from "react-router-dom";
import ReactTable from "react-table"
import moment from 'moment';
import CardHeader from "../../components/Card/CardHeader";
import Divider from "@material-ui/core/Divider";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Radio from "@material-ui/core/Radio";
import SideNav from "../../components/Sidenav/Sidenav";
import './Profile.scss'
import Upload from "./Upload";
import { formatCurrency } from "../../utils";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

class Profile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            branding: '',
            brands: [{
                ages: [], gender: '', interests: [], brandName: ''
            }],
            stage: 0,
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
            changePasswordCard: false,
            changePasswordMessage: '',
            changePasswordSuccess: false,
            deleteAccountModal: false,
            deleteEmail: '', deletePassword: ''
        }
    }

    // addOne () {
    //     // this.setState({stage: 1})
    //     // this.setState({ brands: 1 });
    //     alert(this.state.stage)
    // }

    // addZero () {
    //     this.setState({stage: 0})
    // }

    // addTwo () {
    //     this.setState({stage: 2})
    // }


    componentDidMount() {
        getAuth().onAuthStateChanged((user) => {
            if (user) {
                if (user.emailVerified === true)
                    this.props.setAuthenticated(true, user);
                else
                    this.props.setAuthenticated(false, user);
                this.props.getUser(user.email);
                this.props.getUserOrders(user.email);
            } else {
                this.props.setAuthenticated(false, user);
            }
            this.props.getAgeGenderInterests();
        });
    }

    openNav() {
        document.getElementById("mySidenav").style.width = "250px";
        document.getElementById("main").style.marginLeft = "250px";
    }

    closeNav() {
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("main").style.marginLeft = "0";
    }

    handleSave() {
        const { displayName, subscribe, displayProfileMessage, saveProfile, user, userInfo } = this.props;
        if (displayName === '')
            displayProfileMessage("USER NAME CANNOT BE EMPTY");
        else
            saveProfile(user, displayName, subscribe, userInfo);
    }

    renderOrders() {
        const { classes, ordersArray } = this.props;
        if (ordersArray && ordersArray.length > 0) {
            return ordersArray.map((order, index) => {
                return [
                    order.id || '',
                    "22/11/2019",
                    order ? (order.location ? order.location.name : '') : '',
                    this.componentRender('image', order, index, classes),
                    this.componentRender('price', order, index, classes),
                    order ? (order.quantity || '') : '',
                    this.componentRender('status', order, index, classes),
                    this.componentRender('upload', order, index, classes),
                ]
            })
        }
        return [];
    }


    componentRender(render, order, index, classes) {
        if (render === 'image') {
            return (
                <div className={classes.imgContainer} key={index}>
                    <img src={order ? (order.location ? (order.location.imageUrl || 'https://picsum.photos/id/400/500/500') : 'https://picsum.photos/id/400/500/500') : 'https://picsum.photos/id/400/500/500'}
                        alt="..." className={classes.img} />
                </div>
            )
        } else if (render === 'price') {
            return (
                <span key={index}> {order ? (order.totalPrice ? formatCurrency(order.totalPrice, order.exchange, order.currency) : '') : ''}</span>

            )
        } else if (render === 'status') {
            let status_ = 'PENDING', color = 'warning';
            if (order.status === 0) { status_ = 'PENDING'; color = 'warning' }
            else if (order.status === 1) { status_ = 'CONFIRMED'; color = 'info' }
            else if (order.status === 2) { status_ = 'PAID'; color = 'success' }
            else if (order.status === 3) { status_ = 'COMPLETED'; color = 'success' }
            else if (order.status === 4) { status_ = 'CANCELED'; color = 'danger' }
            else { status_ = 'PENDING'; color = 'warning' }
            return (
                <div className="actions-center">
                    <Badge color={color}>{status_}</Badge>
                </div>
            )
        } else if (render === 'upload') {
            return (<div>
                {order.status !== 1 && !order.isUploaded ? (<Upload order={order} />) :
                    order.isUploaded ? (<Badge color={"success"}>UPLOADED</Badge>) : ""}
            </div>)
        }
    }

    findItem(array = [], item) {
        for (let i = 0; i < array.length; i++) {
            if (array[i].id === item) {
                delete array[i].created_by; //delete this key from object so that we dont have to store so much on the user document in firrebasse
                return array[i];
            }
        }
        return undefined;
    }


    renderTable() {
        const { classes, ordersLoader, ordersArray } = this.props;

        let data = [];
        if (ordersArray && ordersArray.length > 0) {
            data = ordersArray.map((order, index) => {
                return {
                    key: order.id, orderno: order.id || '', location_name: order.location ? (order.location ? order.location.name : '') : '',
                    price: this.componentRender('price', order, index, classes),
                    // orderdt: order.created_at ? moment(order.created_at.toDate()).format('YYYY-MM-DD hh:mm:ss') : '',
                    quantity: order.quantity,
                    image: this.componentRender('image', order, index, classes),
                    status: this.componentRender('status', order, index, classes),
                    upload: this.componentRender('upload', order, index, classes),
                }
            });
        }

        function _filterCaseInsensitive(filter, row) {
            const id = filter.pivotId || filter.id;
            return (
                row[id] !== undefined ?
                    String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase())
                    :
                    true
            );
        }

        return (
            <ReactTable
                data={data}
                filterable
                loading={ordersLoader}
                columns={[
                    {
                        Header: "Order No",
                        accessor: "orderno",
                        headerStyle: { textAlign: "center" },
                    },
                    {
                        Header: "Order Date",
                        accessor: "orderdt",
                        headerStyle: { textAlign: "center" },
                        style: { textAlign: "center" },
                    },
                    {
                        Header: "Adspace Name",
                        accessor: "location_name",
                        headerStyle: { textAlign: "center" },
                        style: { textAlign: "center" },
                    },
                    {
                        Header: "Adspace",
                        accessor: "image",
                        headerStyle: { textAlign: "center" },
                        style: { textAlign: "center" },
                    },
                    {
                        Header: "Price",
                        accessor: "price",
                        headerStyle: { textAlign: "center" },
                        style: { textAlign: "center" },
                    },
                    {
                        Header: "Qty",
                        accessor: "quantity",
                        headerStyle: { textAlign: "center" },
                        style: { textAlign: "center" },
                    },
                    {
                        Header: "Status",
                        accessor: "status",
                        headerStyle: { textAlign: "center" },
                        style: { textAlign: "center" },
                        sortable: false,
                        filterable: false
                    },
                    {
                        Header: "Document Upload",
                        accessor: "upload",
                        headerStyle: { textAlign: "center" },
                        style: { textAlign: "center" },
                        sortable: false,
                        filterable: false
                    },
                ]}
                defaultPageSize={5}
                showPaginationTop={false}
                showPaginationBottom
                className="-striped -highlight"
                defaultFilterMethod={_filterCaseInsensitive}
            />
        )
    }

    handleSaveBrands(brands, branding) {
        const { interestsArray, agesArray, gendersArray, saveBrandsProfile, userInfo, selectedBrand } = this.props;
        const newArray = brands.map((brand => {
            if (brand.gender !== undefined) {
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
            }
        }));

        saveBrandsProfile(newArray, userInfo, selectedBrand);
        this.setState({
            branding: '',
            brands: [{
                ages: [], gender: '', interests: [], brandName: ''
            }]
        })
    }

    renderBrands() {

        const { userInfo, classes, selectedBrand } = this.props;
        const { branding, brands } = this.state;
        //if (!userInfo.hasOwnProperty("brands")) return null;
        let brands_ = userInfo.brands || [];

        if (Array.isArray(brands_) && brands_.length >= 0) {
            return (
                <GridItem sm={11} md={8} sl={8}>
                    <div>
                        <h4 className={classes.title} style={{ textAlign: 'center', color: grayColor[1] }}>My Branding </h4>
                    </div>
                    <Card>
                        <CardBody>
                            {/* <h4 className={classes.title} style={{ textAlign: 'center', color: grayColor[1]}}>My Branding </h4> */}
                            {this.renderDefaultNoBranding(0)}
                            {brands_.map((brand, index) => {
                                return (
                                    <GridContainer key={index}>
                                        {this.renderBrandsDetails(brand, index + 1)}
                                    </GridContainer>
                                );
                            })}
                            {userInfo.isMulti &&
                                (
                                    <GridContainer>
                                        <GridItem xs={12} sm={12} md={12}>
                                            <GridContainer>
                                                <GridItem xs={12} dm={12} md={12}>
                                                    <FormControl fullWidth className={classes.selectFormControl}>
                                                        {this.renderBrandingComponent()}
                                                    </FormControl>
                                                </GridItem>
                                            </GridContainer>
                                            <GridContainer>
                                                <GridItem xs={12} dm={12} md={12}>
                                                    <div className={classes.textCenter} style={{ marginTop: 20, marginBottom: 20 }}>
                                                        <Button color="success" round onClick={() => this.handleSaveBrands(brands, branding)}>
                                                            Save
                                                    </Button>
                                                    </div>
                                                </GridItem>
                                            </GridContainer>
                                        </GridItem>
                                    </GridContainer>
                                )
                            }
                        </CardBody>
                    </Card>
                </GridItem>
            )
        } else return null;
    }

    handleInputChange(value, ind, brands, input) {
        const arr = brands.map((brand, index) => {
            if (ind === index) {
                if (input === 'brandname')
                    return { ...brand, brandName: value };
                else if (input === 'ages' && value.length <= 2)
                    return { ...brand, ages: value };
                else if (input === 'interests' && value.length <= 2)
                    return { ...brand, interests: value };
                else if (input === 'gender')
                    return { ...brand, gender: value };
            }
            return brand
        });
        this.setState({ brands: arr });
    }

    renderBrandingComponent() {
        const { classes, interestsArray, agesArray, gendersArray } = this.props;
        const { brands } = this.state;
        if (brands) {
            return brands.map((brand, index) => {
                const { ages, gender, interests, brandName } = brand;
                return (
                    <GridContainer key={index}>
                        <GridItem xs={12} md={12} sm={12}>
                            <GridContainer>
                                <GridItem sm={2} md={2} lg={2} />
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
                                    <FormControl style={{ marginTop: 10 }} fullWidth className={classes.selectFormControl}>
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
                                                    return (
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
                                                    return (
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
                                                    return (
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
                )
            })
        }
    }

    renderBrandsDetails(brand, index) {
        const { selectedBrand, classes, changeSelectedBrand, removeBrand, userInfo } = this.props;
        return (
            <GridItem sm={12} md={12}>
                <GridContainer>
                    <GridItem sm={12} md={12}>
                        <GridContainer>
                            <GridItem sm={12} md={9}>
                                {brand.hasOwnProperty("brandName") && (
                                    <GridItem sm={12} md={12}>
                                        <GridContainer>
                                            <GridItem sm={12} md={3}>
                                                <h6 style={{ textAlign: 'center', color: grayColor[0] }}>Brand Name</h6>
                                            </GridItem>
                                            <GridItem sm={12} md={3}>
                                                <h6 style={{ textAlign: 'center', color: grayColor[1] }}>{brand.brandName || ''}</h6>
                                            </GridItem>
                                        </GridContainer>
                                    </GridItem>
                                )}
                                {brand.hasOwnProperty("ages") && (
                                    <GridItem sm={12} md={12}>
                                        <GridContainer>
                                            <GridItem sm={12} md={3}>
                                                <h6 style={{ textAlign: 'center', color: grayColor[0] }}>Ages</h6>
                                            </GridItem>
                                            <GridItem sm={12} md={9}>
                                                {brand.ages.map((age, index) => {
                                                    return (
                                                        <Badge key={index} color="primary">{`${age.min || ''} - ${age.max || ''}`}</Badge>
                                                    )
                                                })}
                                            </GridItem>
                                        </GridContainer>
                                    </GridItem>
                                )}
                                {brand.hasOwnProperty("gender") && (
                                    <GridItem sm={12} md={12}>
                                        <GridContainer>
                                            <GridItem sm={12} md={3}>
                                                <h6 style={{ textAlign: 'center', color: grayColor[0] }}>Gender</h6>
                                            </GridItem>
                                            <GridItem sm={12} md={9}>
                                                <Badge color="info">{`${brand.gender ? brand.gender.description : ''}`}</Badge>
                                            </GridItem>
                                        </GridContainer>
                                    </GridItem>
                                )}
                                {brand.hasOwnProperty("interests") && (
                                    <GridItem sm={12} md={12}>
                                        <GridContainer>
                                            <GridItem sm={12} md={3}>
                                                <h6 style={{ textAlign: 'center', color: grayColor[0] }}>Interests</h6>
                                            </GridItem>
                                            <GridItem sm={12} md={9}>
                                                {brand.interests.map((interest, index) => {
                                                    return (
                                                        <Badge key={index} color="success">{`${interest.description || ''}`}</Badge>
                                                    )
                                                })}
                                            </GridItem>
                                        </GridContainer>
                                    </GridItem>
                                )}
                            </GridItem>
                            <GridItem sm={12} md={3}>
                                <GridContainer>
                                    <GridItem sm={12} md={6}>
                                        <div
                                            style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}
                                            className={
                                                classes.checkboxAndRadio +
                                                " " +
                                                classes.checkboxAndRadioHorizontal
                                            }
                                        >
                                            <FormControlLabel
                                                control={
                                                    <Radio
                                                        checked={selectedBrand === index}
                                                        onChange={() => changeSelectedBrand(index)}
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
                                    <GridItem sm={12} md={6}>
                                        <Button style={{ marginTop: 40 }} color="danger" size="sm" justIcon round onClick={() => removeBrand(index, selectedBrand, userInfo)}>
                                            <Close />
                                        </Button>
                                    </GridItem>
                                </GridContainer>
                            </GridItem>
                        </GridContainer>
                    </GridItem>
                    <GridItem sm={12} md={12}>
                        <Divider variant="fullWidth" />
                    </GridItem>
                </GridContainer>
            </GridItem>
        );

    }

    renderDefaultNoBranding(index){
        const { selectedBrand, classes, changeSelectedBrand } = this.props;
        return(
            <GridItem sm={12} md={12}>
                <GridContainer>
                    <GridItem sm={12} md={12}>
                        <GridContainer>
                            <GridItem sm={12} md={9}>
                                <GridItem sm={12} md={12}>
                                    <GridContainer>
                                        <GridItem sm={12} md={3}>
                                            <h6 style={{ textAlign: 'center', color: grayColor[0] }}>Brand Name</h6>
                                        </GridItem>
                                        <GridItem sm={12} md={3}>
                                            <h6 style={{ textAlign: 'center', color: grayColor[1] }}>No Branding (Default)</h6>
                                        </GridItem>
                                    </GridContainer>
                                </GridItem>
                            </GridItem>
                            <GridItem sm={12} md={3}>
                                <GridContainer>
                                    <GridItem sm={12} md={6}>
                                        <div
                                            style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}
                                            className={
                                                classes.checkboxAndRadio +
                                                " " +
                                                classes.checkboxAndRadioHorizontal
                                            }
                                        >
                                            <FormControlLabel
                                                control={
                                                    <Radio
                                                        checked={selectedBrand === index}
                                                        onChange={() => changeSelectedBrand(index)}
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
                                </GridContainer>
                            </GridItem>
                        </GridContainer>
                    </GridItem>
                    <GridItem sm={12} md={12}>
                        <Divider variant="fullWidth" />
                    </GridItem>
                </GridContainer>
            </GridItem>
        )
    }

    renderViews() {
        const { classes, isAuthenticated, user, logOut, loading, editProfile, isEdit, displayName, profileNameChange, profileSubscribeChange,
            subscribe, error, message, userInfo } = this.props;
        const { oldPassword, newPassword, confirmPassword, changePasswordCard, changePasswordMessage,
            changePasswordSuccess} = this.state;

        if (this.state.stage === 0) {
            return <GridContainer >
                <GridItem md={12} xs={12} sm={12} className="margin-body">

                    <GridContainer justify="center" style={{ marginTop: 70 }}>
                        <div>
                            <h4 className={classes.title} style={{ textAlign: 'center', color: grayColor[1] }}>Recent Orders</h4>
                        </div>
                    </GridContainer>
                    <Card>
                        <CardBody>
                            {this.renderTable()}
                        </CardBody>
                    </Card>
                </GridItem>
            </GridContainer>
        } else if (this.state.stage === 1) {
            return (
                <GridContainer justify="center" style={{ marginTop: 70 }}>
                    {this.renderBrands()}
                </GridContainer>
            )
        } else if (this.state.stage === 2) {

            return (
                <div>
                    <GridContainer justify="center" style={{ marginTop: 70 }}>
                        <GridItem md={6}>
                            <h4 className={classes.title} style={{ textAlign: 'center', color: grayColor[1] }}>Manage my Account </h4>
                        </GridItem>
                    </GridContainer>
                    <GridContainer justify="center">
                        <GridItem md={6}>
                            <Card>
                                <CardBody>
                                    <GridContainer>
                                        <GridItem sm={12} xs={12} md={4}>
                                            <h6 style={{ paddingTop: 25 }}>User Name</h6>
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={8}>
                                            <CustomInput
                                                id="name"
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    disabled: !isEdit,
                                                    autoFocus: !isEdit,
                                                    type: "text",
                                                    value: isEdit ? displayName : (user ? (user.displayName || '') : ''),
                                                    onChange: (e) => {
                                                        profileNameChange(e.target.value)
                                                    }
                                                }}
                                            />
                                        </GridItem>
                                    </GridContainer>
                                    <GridContainer>
                                        <GridItem sm={12} xs={12} md={4}>
                                            <h6 style={{ paddingTop: 25 }}>Email</h6>
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={8}>
                                            <CustomInput
                                                id="campaign"
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    disabled: true,
                                                    type: "text",
                                                    value: user ? (user.email || '') : '',
                                                }}
                                            />
                                        </GridItem>
                                    </GridContainer>
                                    <GridContainer>
                                        <GridItem sm={12} xs={12} md={4}>
                                            <h6 style={{ paddingTop: 25 }}>ADWALLET BALANCE</h6>
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={8}>
                                            <CustomInput
                                                id="campaign"
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    disabled: true,
                                                    type: "text",
                                                    value: userInfo ? (userInfo.adWallet ? (userInfo.adWallet.balance ? formatCurrency(userInfo.adWallet.balance,1,'NGN') : 0) : 0 ) : 0,
                                                }}
                                            />
                                        </GridItem>
                                    </GridContainer>
                                    <GridContainer>
                                        <GridItem sm={12} xs={12} md={12}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        tabIndex={-1}
                                                        onClick={() => profileSubscribeChange(!subscribe)}
                                                        checkedIcon={<Check className={classes.checkedIcon} />}
                                                        icon={<Check className={classes.uncheckedIcon} />}
                                                        classes={{
                                                            checked: classes.checked,
                                                            root: classes.checkRoot
                                                        }}
                                                        checked={subscribe}
                                                        disabled={!isEdit}
                                                    />
                                                }
                                                classes={{ label: classes.label, root: classes.labelRoot }}
                                                label="Subscribe to receive updates and new blog posts in email?"
                                            />
                                        </GridItem>
                                    </GridContainer>
                                    {error &&
                                        <GridContainer justify="center">
                                            <GridItem xs={12} sm={12} md={6}>
                                                <p style={{ color: "#ef5350", fontWeight: "bold" }}>{message || ''}</p>
                                            </GridItem>
                                        </GridContainer>
                                    }
                                    <GridContainer justify="center">
                                        <GridItem xs={12} sm={12} md={4}>
                                            <Button color={isEdit ? "success" : "info"} onClick={() => !isEdit ? editProfile(true) : this.handleSave()}>
                                                {isEdit ? 'SAVE PROFILE' : 'EDIT PROFILE'}
                                            </Button>
                                        </GridItem>
                                        {isEdit &&
                                            <GridItem xs={12} sm={12} md={4}>
                                                <Button color="danger" onClick={() => editProfile(false)}>
                                                    CANCEL
                                            </Button>
                                            </GridItem>
                                        }
                                    </GridContainer>
                                    <GridContainer justify="center">
                                        <GridItem xs={12} sm={12} md={4}>
                                            <Button color="warning" size="sm" simple={true} onClick={() => this.setState({changePasswordCard: true})}>
                                                <p style={{ fontSize: 13,}}>Change Password</p>
                                            </Button>
                                        </GridItem>
                                    </GridContainer>
                                    <GridContainer justify="center">
                                        <GridItem xs={12} sm={12} md={4}>
                                            <Button color="danger" size="sm" simple={true} onClick={() => this.setState({deleteAccountModal: true})}>
                                                <p style={{ fontSize: 13, textAlign: 'center'}}>{`Delete Account`}</p>
                                            </Button>
                                        </GridItem>
                                    </GridContainer>
                                </CardBody>
                            </Card>
                        </GridItem>
                    </GridContainer>
                    {changePasswordCard &&
                    <GridContainer justify="center">
                        <GridItem md={6}>
                            <Card>
                                <CardBody>
                                    {changePasswordSuccess ? (
                                        <>
                                            <GridContainer justify="center">
                                                <GridItem xs={12} sm={12} md={12}>
                                                    <p className={classes.successMessage}>Your Password has Been changed Successfully!</p>
                                                </GridItem>
                                            </GridContainer>
                                            <GridContainer justify="center">
                                                <GridItem xs={12} sm={12} md={4}>
                                                    <Button color="success" onClick={() => this.setState({
                                                        oldPassword: '', newPassword: '', confirmPassword: '', changePasswordCard:false,
                                                        changePasswordMessage: '', changePasswordSuccess: false
                                                    })}>
                                                        OK
                                                    </Button>
                                                </GridItem>
                                            </GridContainer>
                                        </>
                                    ) :
                                    (
                                        <>
                                            <GridContainer>
                                                <GridItem sm={12} xs={12} md={4}>
                                                    <h6 style={{ paddingTop: 25 }}>Old Password</h6>
                                                </GridItem>
                                                <GridItem xs={12} sm={12} md={8}>
                                                    <CustomInput
                                                        id="name"
                                                        formControlProps={{
                                                            fullWidth: true
                                                        }}
                                                        inputProps={{
                                                            type: "password",
                                                            value: oldPassword || '',
                                                            onChange: (e) => {
                                                                this.setState({oldPassword: e.target.value})
                                                            }
                                                        }}
                                                    />
                                                </GridItem>
                                            </GridContainer>
                                            <GridContainer>
                                                <GridItem sm={12} xs={12} md={4}>
                                                    <h6 style={{ paddingTop: 25 }}>New Password</h6>
                                                </GridItem>
                                                <GridItem xs={12} sm={12} md={8}>
                                                    <CustomInput
                                                        id="campaign"
                                                        formControlProps={{
                                                            fullWidth: true
                                                        }}
                                                        inputProps={{
                                                            type: "password",
                                                            value: newPassword || '',
                                                            onChange: (e) => {
                                                                this.setState({newPassword: e.target.value})
                                                            }
                                                        }}
                                                    />
                                                </GridItem>
                                            </GridContainer>
                                            <GridContainer>
                                                <GridItem sm={12} xs={12} md={4}>
                                                    <h6 style={{ paddingTop: 25 }}>Confirm Password</h6>
                                                </GridItem>
                                                <GridItem xs={12} sm={12} md={8}>
                                                    <CustomInput
                                                        id="campaign"
                                                        formControlProps={{
                                                            fullWidth: true
                                                        }}
                                                        inputProps={{
                                                            type: "password",
                                                            value: confirmPassword || '',
                                                            onChange: (e) => {
                                                                this.setState({confirmPassword: e.target.value})
                                                            }
                                                        }}
                                                    />
                                                </GridItem>
                                            </GridContainer>
                                            <GridContainer justify="center">
                                                <GridItem xs={12} sm={12} md={12}>
                                                    <p style={{ color: "#ef5350", fontWeight: "bold" }}>{changePasswordMessage || ''}</p>
                                                </GridItem>
                                            </GridContainer>
                                            <GridContainer justify="center">
                                                <GridItem xs={12} sm={12} md={4}>
                                                    <Button color="success" onClick={() => this.handleChangePassword()}>
                                                        CHANGE
                                                    </Button>
                                                </GridItem>
                                                <GridItem xs={12} sm={12} md={4}>
                                                    <Button color="danger" onClick={() => this.setState({changePasswordCard: false})}>
                                                        CANCEL
                                                    </Button>
                                                </GridItem>
                                            </GridContainer>
                                        </>
                                    )}
                                </CardBody>
                            </Card>
                        </GridItem>
                    </GridContainer>
                    }
                </div>
            )
        }
        return null
    }

    async handleChangePassword(){
        const { oldPassword, newPassword, confirmPassword } = this.state;
        const { user } = this.props;
        if (oldPassword === '') this.setState({ changePasswordMessage: 'Old Password cannot be empty'});
        else if (newPassword === '') this.setState({ changePasswordMessage: 'New Password cannot be empty'});
        else if (confirmPassword === '') this.setState({ changePasswordMessage: 'Confirm Password cannot be empty'});
        else if (newPassword !== confirmPassword) this.setState({ changePasswordMessage: 'The two Passwords dont match'});
        else {
            try{
                let loggedUser = await getAuth().signInWithEmailAndPassword(user.email, oldPassword);
                await loggedUser.user.updatePassword(newPassword);
                this.setState({changePasswordSuccess: true});
            }
            catch (e) {
                //console.log(e)
                if (e.code === 'auth/wrong-password') this.setState({ changePasswordMessage: 'Failed: Wrong old password!'});
                else this.setState({ changePasswordMessage: e.message || 'Error occurred during change password'})
            }
        }
    }

    renderDeleteAccountModal(classes){
        const { deleteAccountModal, deleteEmail, deletePassword } = this.state;
        const { deleteAccount, message, loading } = this.props;

        if (deleteAccountModal){
            return(
                <Dialog
                    classes={{
                        root: classes.modalRoot,
                        paper: classes.modal + " " + classes.modalLogin
                    }}
                    open={deleteAccountModal}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={() => this.setState({deleteAccountModal: false})}
                    aria-labelledby="login-modal-slide-title"
                    aria-describedby="login-modal-slide-description"
                >
                    <Card plain className={classes.modalLoginCard}>
                        <DialogTitle
                            id="login-modal-slide-title"
                            disableTypography
                            className={classes.modalHeader}
                        >
                            <CardHeader
                                plain
                                color="primary"
                                className={`${classes.textCenter} ${classes.cardLoginHeader}`}
                            >
                                <Button
                                    simple
                                    className={classes.modalCloseButton}
                                    key="close"
                                    aria-label="Close"
                                    onClick={() => this.setState({deleteAccountModal: false})}
                                >
                                    {" "}
                                    <Close className={classes.modalClose} />
                                </Button>
                                <h5 className={classes.cardTitleWhite}>Login First to Delete Your account</h5>
                            </CardHeader>
                        </DialogTitle>
                        <DialogContent
                            id="login-modal-slide-description"
                            className={classes.modalBody}
                        >
                            <form>
                                <CardBody className={classes.cardLoginBody}>
                                    <CustomInput
                                        id="login-modal-email"
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            value: deleteEmail,
                                            type: "email",
                                            placeholder: "Email...",
                                            onChange: (e) => {
                                                this.setState({ deleteEmail: e.target.value})
                                            }
                                        }}
                                    />
                                    <CustomInput
                                        id="login-modal-pass"
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            value: deletePassword,
                                            type: "password",
                                            placeholder: "Password...",
                                            onChange: (e) => {
                                                this.setState({ deletePassword: e.target.value})
                                            }
                                        }}
                                    />
                                    {loading && (
                                        <div className={classes.textCenter}>
                                            <CircularProgress />
                                        </div>
                                    )}
                                    <h6 style={{ color: 'red', fontWeight: 'bold', textAlign: 'center'}} className={classes.errorMessage}>
                                        {message || ""}
                                    </h6>
                                </CardBody>
                            </form>
                        </DialogContent>
                        <DialogActions
                            className={`${classes.modalFooter} ${classes.justifyContentCenter}`}
                        >
                            <Button color="primary" size="lg" onClick={() => this.setState({deleteAccountModal: false})}>
                                Cancel
                            </Button>
                            <Button color="primary" simple size="lg" onClick={() => deleteAccount(deleteEmail, deletePassword)}>
                                Delete Account
                            </Button>
                        </DialogActions>
                    </Card>
                </Dialog>
            )
        }
    }

    render() {
        const { classes, isAuthenticated, user, logOut, loading } = this.props;
        if (!isAuthenticated) {
            return (
                <Redirect to={{ pathname: '/login', state: { route: '/profile' } }} />
            )
        }

        return (
            <div>
                {this.renderDeleteAccountModal(classes)}
                <Header
                    brand="ADSPACE"
                    links={<HeaderLinks dropdownHoverColor="rose" isAuthenticated={isAuthenticated} user={user} logOutUser={() => logOut()} />}
                // color="dark"
                // changeColorOnScroll={{
                //     height: 300,
                //     color: "info"
                // }}
                />
                {loading &&
                    <LinearProgress />
                }

                <div>
                    <GridContainer>
                        <GridItem md={2}>
                            <SideNav basicState={this.state.stage} addOne={() => this.setState({ stage: 1 })} addTwo={() => this.setState({ stage: 2 })} addZero={() => this.setState({ stage: 0 })} />
                        </GridItem>
                        <GridItem md={10} style={{ height: '100vh', overflow: 'scroll' }}>
                            <div justify="center">
                                {this.renderViews()}
                                {/* <GridContainer style={{marginRight: 15}}>
                        <GridItem md={12} xs={12} sm={12}>
                            <Card>
                                <CardBody>
                                    {this.renderTable()}
                                </CardBody>
                            </Card>
                        </GridItem>
                    </GridContainer> */}
                                {/* <GridContainer justify="center">
                        <GridItem md={6}>
                            <h4 className={classes.title} style={{ textAlign: 'center', color: grayColor[1]}}>Manage my Account </h4>
                        </GridItem>
                    </GridContainer>
                    <GridContainer justify="center">
                        <GridItem md={6}>
                            <Card>
                                <CardBody>
                                    <GridContainer>
                                        <GridItem sm={12} xs={12} md={4}>
                                            <h6 style={{ paddingTop: 25}}>User Name</h6>
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={8}>
                                            <CustomInput
                                                id="name"
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    disabled: !isEdit,
                                                    autoFocus: !isEdit,
                                                    type: "text",
                                                    value: isEdit ? displayName : (user ? (user.displayName || '') : ''),
                                                    onChange: (e) => {
                                                        profileNameChange(e.target.value)
                                                    }
                                                }}
                                            />
                                        </GridItem>
                                    </GridContainer>
                                    <GridContainer>
                                        <GridItem sm={12} xs={12} md={4}>
                                            <h6 style={{ paddingTop: 25}}>Email</h6>
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={8}>
                                            <CustomInput
                                                id="campaign"
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    disabled: true,
                                                    type: "text",
                                                    value: user ? (user.email || '') : '',
                                                }}
                                            />
                                        </GridItem>
                                    </GridContainer>
                                    <GridContainer>
                                        <GridItem sm={12} xs={12} md={12}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        tabIndex={-1}
                                                        onClick={() => profileSubscribeChange(!subscribe)}
                                                        checkedIcon={<Check className={classes.checkedIcon} />}
                                                        icon={<Check className={classes.uncheckedIcon} />}
                                                        classes={{
                                                            checked: classes.checked,
                                                            root: classes.checkRoot
                                                        }}
                                                        checked={subscribe}
                                                        disabled={!isEdit}
                                                    />
                                                }
                                                classes={{ label: classes.label, root: classes.labelRoot }}
                                                label="Subscribe to receive updates and new blog posts in email?"
                                            />
                                        </GridItem>
                                    </GridContainer>
                                    {error &&
                                    <GridContainer justify="center">
                                        <GridItem xs={12} sm={12} md={6}>
                                            <p style={{ color: "#ef5350", fontWeight: "bold"}}>{message || ''}</p>
                                        </GridItem>
                                    </GridContainer>
                                    }
                                    <GridContainer justify="center">
                                        <GridItem xs={12} sm={12} md={4}>
                                            <Button color={isEdit ? "success" : "info"} onClick={() => !isEdit ? editProfile(true) : this.handleSave()}>
                                                {isEdit ? 'SAVE PROFILE' : 'EDIT PROFILE'}
                                            </Button>
                                        </GridItem>
                                        {isEdit &&
                                        <GridItem xs={12} sm={12} md={4}>
                                            <Button color="danger" onClick={() => editProfile(false)}>
                                                CANCEL
                                            </Button>
                                        </GridItem>
                                        }
                                    </GridContainer>
                                </CardBody>
                            </Card>
                        </GridItem>
                    </GridContainer> */}
                                {/* <GridContainer justify="center">
                        {this.renderBrands()}
                    </GridContainer> */}
                            </div>
                        </GridItem>
                    </GridContainer>

                </div>
            </div>
        )
    }
}


const mapStateToProps = ({ profile, login, branding }) => {
    const { loading, error, message, isEdit, displayName, subscribe, ordersArray, ordersLoader, userInfo,
        selectedBrand, success, } = profile;
    const { isAuthenticated, user } = login;
    const { agesArray, gendersArray, interestsArray } = branding;

    return {
        loading, error, message, isAuthenticated, user, isEdit, displayName, subscribe, ordersArray, ordersLoader, userInfo,
        agesArray, gendersArray, interestsArray, selectedBrand, success,
    };
};

export default connect(mapStateToProps, {
    logOut, setAuthenticated, editProfile, profileNameChange, profileSubscribeChange, getUser,
    displayProfileMessage, saveProfile, getUserOrders, getAgeGenderInterests, saveBrandsProfile,
    changeSelectedBrand, removeBrand, deleteAccount
})(withStyles(shoppingCartStyle)(Profile));
