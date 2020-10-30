import moment from "moment";

export const download = (locations, exchange, currency, startDate, user) => {
    let headers = {
        number: '#',
        name: 'Adspace Name',
        category: 'Adtype/Channel',
        subCategory: 'Subtype',
        vendor: "Vendor",
        state: "State",
        city: "City",
        unit: 'Ad Unit',
        startDate: "Start Date",
        endDate: "End Date",
        price: "Rate",
        method: "Method",
        quantity: "Quantity",
        total: "Total"
    };


    let itemsNotFormatted = locations;

    let itemsFormatted = [];
    let total = 0;

    // format the data
    itemsNotFormatted.forEach((item, index) => {
        total = total + getPrice(item.price) * item.userAddedQuantity;
        itemsFormatted.push({
            number: index + 1,
            name: item.name ? item.name.replace(/,/g, '') : '',
            category: item.category ? item.category.name ? item.category.name.replace(/,/g, ''): '' : '', // remove commas to avoid errors
            subCategory: item.subCategory ? item.subCategory.name ? item.subCategory.name.replace(/,/g, ''): '' : '', // remove commas to avoid errors
            vendor: item.company ? item.company.name ? item.company.name.replace(/,/g, '') : '' : '',
            state: item.state ? (item.state.name ? item.state.name.replace(/,/g, '') : '') : '',
            city: item.city ? (item.city.name ? item.city.name.replace(/,/g, '') : '') : '',
            unit: getAdUnit(item) || '',
            startDate: item.startDate ? item.startDate.replace(/,/g, '') : '',
            endDate: item.endDate ? item.endDate.replace(/,/g, '') : '',
            price: formatPrice(item.price, currency) || '',
            method: `Per ${item.pricingOption ? (item.pricingOption.name || '') : ''}`,
            quantity: item.userAddedQuantity ? String(item.userAddedQuantity) : '',
            total: `${currency ? currency.toUpperCase() : ''} ${getPrice(item.price) * item.userAddedQuantity}`
        });
    });


    itemsFormatted.push({number: 'Total', name: '', category: '', subCategory: '', vendor: "", state: "",
        city: "", unit: '', startDate: "", endDate: "", price: "", method: "", quantity: "", total: `${currency ? currency.toUpperCase() : ''} ${total}`});


    let fileTitle = 'Media Plan';
    exportCSVFile(headers, itemsFormatted, fileTitle, user, startDate, `${currency ? currency.toUpperCase() : ''} ${total}`);
};

function exportCSVFile(headers, items, fileTitle, user, startDate, total) {
    if (headers) {
        items.unshift(headers);
    }

    items.unshift({number: ' ', name: '', category: '', subCategory: '', vendor: "", unit: '',
        startDate: "", endDate: "", price: "", method: "", quantity: "", total: ""});

    items.unshift({number: 'Total Ad Spend', name: total || '', category: '', subCategory: '', vendor: "", unit: '',
        startDate: "", endDate: "", price: "", method: "", quantity: "", total: ""});

    items.unshift({number: 'Start Date', name: moment(startDate.toDate()).format("DD/MM/YYYY"), category: '', subCategory: '', vendor: "", unit: '',
        startDate: "", endDate: "", price: "", method: "", quantity: "", total: ""});

    items.unshift({number: ' ', name: '', category: '', subCategory: '', vendor: "", unit: '',
        startDate: "", endDate: "", price: "", method: "", quantity: "", total: ""});

    items.unshift({number:  ' ', name: user ? (user.phoneNumber ? 'T: ' + user.phoneNumber.replace(/,/g, '') : '') : '', category: '', subCategory: '', vendor: "", unit: '',
        startDate: "", endDate: "", price: "", method: "", quantity: "", total: ""});

    items.unshift({number: ' ', name: user ? (user.id.replace(/,/g, '') || '') : '', category: '', subCategory: '', vendor: "", unit: '',
        startDate: "", endDate: "", price: "", method: "", quantity: "", total: ""});

    items.unshift({number: 'Prepared by', name: user ? (user.name.replace(/,/g, '') || '') : '', category: '', subCategory: '', vendor: "", unit: '',
        startDate: "", endDate: "", price: "", method: "", quantity: "", total: ""});

    items.unshift({number: '', name: '', category: '', subCategory: '', vendor: "", unit: '',
        startDate: "", endDate: "", price: "", method: "", quantity: "", total: ""});

    items.unshift({number: user ? (user.currentBrand ? user.currentBrand.brandName || '' : '') : '', name: '', category: '', subCategory: '', vendor: "", unit: '',
        startDate: "", endDate: "", price: "", method: "", quantity: "", total: ""});

    items.unshift({number: 'Media Plan', name: '', category: '', subCategory: '', vendor: "", unit: '',
        startDate: "", endDate: "", price: "", method: "", quantity: "", total: ""});

    // Convert Object to JSON
    let jsonObject = JSON.stringify(items);

    let csv = convertToCSV(jsonObject);

    let exportedFilenmae = fileTitle + '.csv' || 'export.csv';

    let blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        let link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            let url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}



function convertToCSV(objArray) {
    let array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = '';

    for (let i = 0; i < array.length; i++) {
        let line = '';
        for (let index in array[i]) {
            if (line !== '') line += ',';

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}

function formatPrice(price = {}, currency) {
    return `${currency ? currency.toUpperCase() : ''} ${getPrice(price) || ''}`;
}

function getPrice(price = {}) {
    if (price.hasOwnProperty("discountedPrice")){
        if (price.discountedPrice.hasOwnProperty("checked")){
            if (price.discountedPrice.checked){
                if (price.discountedPrice.hasOwnProperty("value")){
                    return price.discountedPrice.value;
                }
            }
        }
    }
    return price;
}

function getAdUnit(location) {
    if (location.hasOwnProperty("duration")){
       if (location.duration !== 0)
           return `${location.duration || ''} sec`;
    }

    if (location.hasOwnProperty("size")){
        if(location.size !== 0)
            return `${location.size || ''} sqm`
    }

    if (location.hasOwnProperty("dimension")){
        if (location.dimension.hasOwnProperty("breadth") && location.dimension.hasOwnProperty("length"))
            return `${location.dimension.breadth} X ${location.dimension.length} m`;
    }

    return '';
}


