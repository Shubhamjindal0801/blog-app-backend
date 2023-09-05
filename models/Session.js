const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
  expires: {
    type: Date,
  },
  session: {
    type: Object,
  },
});

module.exports = mongoose.model("sessions", SessionSchema);
