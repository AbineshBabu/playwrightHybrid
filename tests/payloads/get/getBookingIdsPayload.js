export class GetBookingIDsPayload {
    constructor() {
        this.bookingid = []
    }

    setBookings(bookingsArray) {
        if (Array.isArray(bookingsArray)) {
            this._bookings = bookingsArray;
        } else {
            throw new Error("Expected an array of booking objects");
        }
        return this;
    }

    getBookingID() {
        return this.bookingid;
    }

    getBookingCount() {
        return this._bookings.length;
    }

    buildResponse() {
        return this._bookings;
    }
}