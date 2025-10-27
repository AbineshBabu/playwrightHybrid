export class PostBookingPayload {
    constructor() {
        this._firstname = "testing";
        this._lastname = "one";
        this._totalprice = 555;
        this._depositpaid = true;
        this._bookingdates = {
            checkin: "2018-01-01",
            checkout: "2019-01-01",
        };
        this._additionalneeds = "Breakfast";
        this.bookingid = null;
    }

    // firstname
    getfirstname() {
        return this._firstname;
    }
    setfirstname(value) {
        this._firstname = value;
    }

    // lastname
    getlastname() {
        return this._lastname;
    }
    setlastname(value) {
        this._lastname = value;
    }

    // totalprice
    gettotalprice() {
        return this._totalprice;
    }
    settotalprice(value) {
        this._totalprice = value;
    }

    // depositpaid
    getdepositpaid() {
        return this._depositpaid;
    }
    setdepositpaid(value) {
        this._depositpaid = value;
    }

    // bookingdates (object)
    getbookingdates() {
        return this._bookingdates;
    }
    setbookingdates(value) {
        this._bookingdates = value;
    }

    // convenience accessors for bookingdates.checkin / checkout
    getcheckin() {
        return this._bookingdates.checkin;
    }
    setcheckin(value) {
        this._bookingdates.checkin = value;
    }

    getcheckout() {
        return this._bookingdates.checkout;
    }
    setcheckout(value) {
        this._bookingdates.checkout = value;
    }

    // additionalneeds
    getadditionalneeds() {
        return this._additionalneeds;
    }
    setadditionalneeds(value) {
        this._additionalneeds = value;
    }

    getBookingID() {
        return this.bookingid;
    }
    setBookingID(value) {
        this.bookingid = value;
    }

    build() {
        return {
            firstname: this._firstname,
            lastname: this._lastname,
            totalprice: this._totalprice,
            depositpaid: this._depositpaid,
            bookingdates: this._bookingdates,
            additionalneeds: this._additionalneeds,
        };
    }

    updateFromResponse(responseJson) {
        this.bookingid = responseJson.bookingid;
        this._firstname = responseJson.firstname;
        this._lastname = responseJson.lastname;
        this._totalprice = responseJson.totalprice;
        this._depositpaid = responseJson.depositpaid;
        this._bookingdates = responseJson.bookingdates;
        this._additionalneeds = responseJson.additionalneeds;
    }

}