const mongoose = require("mongoose");
const phone = require("./models/phoneLenght");
require("dotenv").config();
mongoose.set('strictQuery', false);

mongoose
    .connect(process.env.mongoURI,
        {
            useNewUrlParser: true, useUnifiedTopology: true
        })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("MongoDB", err));

const seedAdmin = [
    {
        "name": "Afghanistan",
        "iso3": "AFG",
        "iso2": "AF",
        "phone_code": "+93",
        "emoji": "🇦🇫",
        "emoji_code": "U+1F1E6 U+1F1EB",
        "phone_length": 9
    },
    {
        "name": "Algeria",
        "iso3": "DZA",
        "iso2": "DZ",
        "phone_code": "+213",
        "emoji": "🇩🇿",
        "emoji_code": "U+1F1E9 U+1F1FF",
        "phone_length": 9
    },
    {
        "name": "American Samoa",
        "iso3": "ASM",
        "iso2": "AS",
        "phone_code": "+1-684",
        "emoji": "🇦🇸",
        "emoji_code": "U+1F1E6 U+1F1F8",
        "phone_length": 10
    },
    {
        "name": "Anguilla",
        "iso3": "AIA",
        "iso2": "AI",
        "phone_code": "+1-264",
        "emoji": "🇦🇮",
        "emoji_code": "U+1F1E6 U+1F1EE",
        "phone_length": 10
    },
    {
        "name": "Antigua And Barbuda",
        "iso3": "ATG",
        "iso2": "AG",
        "phone_code": "+1-268",
        "emoji": "🇦🇬",
        "emoji_code": "U+1F1E6 U+1F1EC",
        "phone_length": 10
    },
    {
        "name": "Armenia",
        "iso3": "ARM",
        "iso2": "AM",
        "phone_code": "+374",
        "emoji": "🇦🇲",
        "emoji_code": "U+1F1E6 U+1F1F2",
        "phone_length": 8
    },
    {
        "name": "Aruba",
        "iso3": "ABW",
        "iso2": "AW",
        "phone_code": "+297",
        "emoji": "🇦🇼",
        "emoji_code": "U+1F1E6 U+1F1FC",
        "phone_length": 7
    },
    {
        "name": "Australia",
        "iso3": "AUS",
        "iso2": "AU",
        "phone_code": "+61",
        "emoji": "🇦🇺",
        "emoji_code": "U+1F1E6 U+1F1FA",
        "phone_length": 9
    },
    {
        "name": "Austria",
        "iso3": "AUT",
        "iso2": "AT",
        "phone_code": "+43",
        "emoji": "🇦🇹",
        "emoji_code": "U+1F1E6 U+1F1F9",
        "phone_length": 10
    },
    {
        "name": "Azerbaijan",
        "iso3": "AZE",
        "iso2": "AZ",
        "phone_code": "+994",
        "emoji": "🇦🇿",
        "emoji_code": "U+1F1E6 U+1F1FF",
        "phone_length": 9
    },
    {
        "name": "Bahrain",
        "iso3": "BHR",
        "iso2": "BH",
        "phone_code": "+973",
        "emoji": "🇧🇭",
        "emoji_code": "U+1F1E7 U+1F1ED",
        "phone_length": 8
    },
    {
        "name": "Bangladesh",
        "iso3": "BGD",
        "iso2": "BD",
        "phone_code": "+880",
        "emoji": "🇧🇩",
        "emoji_code": "U+1F1E7 U+1F1E9",
        "phone_length": 10
    },
    {
        "name": "Barbados",
        "iso3": "BRB",
        "iso2": "BB",
        "phone_code": "+1-246",
        "emoji": "🇧🇧",
        "emoji_code": "U+1F1E7 U+1F1E7",
        "phone_length": 10
    },
    {
        "name": "Belarus",
        "iso3": "BLR",
        "iso2": "BY",
        "phone_code": "+375",
        "emoji": "🇧🇾",
        "emoji_code": "U+1F1E7 U+1F1FE",
        "phone_length": 9
    },
    {
        "name": "Belgium",
        "iso3": "BEL",
        "iso2": "BE",
        "phone_code": "+32",
        "emoji": "🇧🇪",
        "emoji_code": "U+1F1E7 U+1F1EA",
        "phone_length": 9
    },
    {
        "name": "Belize",
        "iso3": "BLZ",
        "iso2": "BZ",
        "phone_code": "+501",
        "emoji": "🇧🇿",
        "emoji_code": "U+1F1E7 U+1F1FF",
        "phone_length": 7
    },
    {
        "name": "Benin",
        "iso3": "BEN",
        "iso2": "BJ",
        "phone_code": "+229",
        "emoji": "🇧🇯",
        "emoji_code": "U+1F1E7 U+1F1EF",
        "phone_length": 9
    },
    {
        "name": "Bermuda",
        "iso3": "BMU",
        "iso2": "BM",
        "phone_code": "+1-441",
        "emoji": "🇧🇲",
        "emoji_code": "U+1F1E7 U+1F1F2",
        "phone_length": 10
    },
    {
        "name": "Bosnia and Herzegovina",
        "iso3": "BIH",
        "iso2": "BA",
        "phone_code": "+387",
        "emoji": "🇧🇦",
        "emoji_code": "U+1F1E7 U+1F1E6",
        "phone_length": 8
    },
    {
        "name": "Brazil",
        "iso3": "BRA",
        "iso2": "BR",
        "phone_code": "+55",
        "emoji": "🇧🇷",
        "emoji_code": "U+1F1E7 U+1F1F7",
        "phone_length": 11
    },
    {
        "name": "Burkina Faso",
        "iso3": "BFA",
        "iso2": "BF",
        "phone_code": "+226",
        "emoji": "🇧🇫",
        "emoji_code": "U+1F1E7 U+1F1EB",
        "phone_length": 8
    },
    {
        "name": "Cambodia",
        "iso3": "KHM",
        "iso2": "KH",
        "phone_code": "+855",
        "emoji": "🇰🇭",
        "emoji_code": "U+1F1F0 U+1F1ED",
        "phone_length": 9
    },
    {
        "name": "Cameroon",
        "iso3": "CMR",
        "iso2": "CM",
        "phone_code": "+237",
        "emoji": "🇨🇲",
        "emoji_code": "U+1F1E8 U+1F1F2",
        "phone_length": 9
    },
    {
        "name": "Canada",
        "iso3": "CAN",
        "iso2": "CA",
        "phone_code": "+1",
        "emoji": "🇨🇦",
        "emoji_code": "U+1F1E8 U+1F1E6",
        "phone_length": 10
    },
    {
        "name": "Cayman Islands",
        "iso3": "CYM",
        "iso2": "KY",
        "phone_code": "+1-345",
        "emoji": "🇰🇾",
        "emoji_code": "U+1F1F0 U+1F1FE",
        "phone_length": 10
    },
    {
        "name": "Chad",
        "iso3": "TCD",
        "iso2": "TD",
        "phone_code": "+235",
        "emoji": "🇹🇩",
        "emoji_code": "U+1F1F9 U+1F1E9",
        "phone_length": 8
    },
    {
        "name": "Chile",
        "iso3": "CHL",
        "iso2": "CL",
        "phone_code": "+56",
        "emoji": "🇨🇱",
        "emoji_code": "U+1F1E8 U+1F1F1",
        "phone_length": 9
    },
    {
        "name": "China",
        "iso3": "CHN",
        "iso2": "CN",
        "phone_code": "+86",
        "emoji": "🇨🇳",
        "emoji_code": "U+1F1E8 U+1F1F3",
        "phone_length": 13
    },
    {
        "name": "Colombia",
        "iso3": "COL",
        "iso2": "CO",
        "phone_code": "+57",
        "emoji": "🇨🇴",
        "emoji_code": "U+1F1E8 U+1F1F4",
        "phone_length": 10
    },
    {
        "name": "Cook Islands",
        "iso3": "COK",
        "iso2": "CK",
        "phone_code": "+682",
        "emoji": "🇨🇰",
        "emoji_code": "U+1F1E8 U+1F1F0",
        "phone_length": 5
    },
    {
        "name": "Costa Rica",
        "iso3": "CRI",
        "iso2": "CR",
        "phone_code": "+506",
        "emoji": "🇨🇷",
        "emoji_code": "U+1F1E8 U+1F1F7",
        "phone_length": 8
    },
    {
        "name": "Croatia",
        "iso3": "HRV",
        "iso2": "HR",
        "phone_code": "+385",
        "emoji": "🇭🇷",
        "emoji_code": "U+1F1ED U+1F1F7",
        "phone_length": 9
    },
    {
        "name": "Cyprus",
        "iso3": "CYP",
        "iso2": "CY",
        "phone_code": "+357",
        "emoji": "🇨🇾",
        "emoji_code": "U+1F1E8 U+1F1FE",
        "phone_length": 8
    },
    {
        "name": "Czech Republic",
        "iso3": "CZE",
        "iso2": "CZ",
        "phone_code": "+420",
        "emoji": "🇨🇿",
        "emoji_code": "U+1F1E8 U+1F1FF",
        "phone_length": 9
    },
    {
        "name": "Denmark",
        "iso3": "DNK",
        "iso2": "DK",
        "phone_code": "+45",
        "emoji": "🇩🇰",
        "emoji_code": "U+1F1E9 U+1F1F0",
        "phone_length": 8
    },
    {
        "name": "Dominica",
        "iso3": "DMA",
        "iso2": "DM",
        "phone_code": "+1-767",
        "emoji": "🇩🇲",
        "emoji_code": "U+1F1E9 U+1F1F2",
        "phone_length": 10
    },
    {
        "name": "Dominican Republic",
        "iso3": "DOM",
        "iso2": "DO",
        "phone_code": "+1-809",
        "emoji": "🇩🇴",
        "emoji_code": "U+1F1E9 U+1F1F4",
        "phone_length": 10
    },
    {
        "name": "Ecuador",
        "iso3": "ECU",
        "iso2": "EC",
        "phone_code": "+593",
        "emoji": "🇪🇨",
        "emoji_code": "U+1F1EA U+1F1E8",
        "phone_length": 9
    },
    {
        "name": "Egypt",
        "iso3": "EGY",
        "iso2": "EG",
        "phone_code": "+20",
        "emoji": "🇪🇬",
        "emoji_code": "U+1F1EA U+1F1EC",
        "phone_length": 10
    },
    {
        "name": "El Salvador",
        "iso3": "SLV",
        "iso2": "SV",
        "phone_code": "+503",
        "emoji": "🇸🇻",
        "emoji_code": "U+1F1F8 U+1F1FB",
        "phone_length": 8
    },
    {
        "name": "Estonia",
        "iso3": "EST",
        "iso2": "EE",
        "phone_code": "+372",
        "emoji": "🇪🇪",
        "emoji_code": "U+1F1EA U+1F1EA",
        "phone_length": 8
    },
    {
        "name": "Faroe Islands",
        "iso3": "FRO",
        "iso2": "FO",
        "phone_code": "+298",
        "emoji": "🇫🇴",
        "emoji_code": "U+1F1EB U+1F1F4",
        "phone_length": 5
    },
    {
        "name": "French Guiana",
        "iso3": "GUF",
        "iso2": "GF",
        "phone_code": "+594",
        "emoji": "🇬🇫",
        "emoji_code": "U+1F1EC U+1F1EB",
        "phone_length": 9
    },
    {
        "name": "French Polynesia",
        "iso3": "PYF",
        "iso2": "PF",
        "phone_code": "+689",
        "emoji": "🇵🇫",
        "emoji_code": "U+1F1F5 U+1F1EB",
        "phone_length": 6
    },
    {
        "name": "Gabon",
        "iso3": "GAB",
        "iso2": "GA",
        "phone_code": "+241",
        "emoji": "🇬🇦",
        "emoji_code": "U+1F1EC U+1F1E6",
        "phone_length": 7
    },
    {
        "name": "Georgia",
        "iso3": "GEO",
        "iso2": "GE",
        "phone_code": "+995",
        "emoji": "🇬🇪",
        "emoji_code": "U+1F1EC U+1F1EA",
        "phone_length": 9
    },
    {
        "name": "Germany",
        "iso3": "DEU",
        "iso2": "DE",
        "phone_code": "+49",
        "emoji": "🇩🇪",
        "emoji_code": "U+1F1E9 U+1F1EA",
        "phone_length": 10
    },
    {
        "name": "Ghana",
        "iso3": "GHA",
        "iso2": "GH",
        "phone_code": "+233",
        "emoji": "🇬🇭",
        "emoji_code": "U+1F1EC U+1F1ED",
        "phone_length": 9
    },
    {
        "name": "Greece",
        "iso3": "GRC",
        "iso2": "GR",
        "phone_code": "+30",
        "emoji": "🇬🇷",
        "emoji_code": "U+1F1EC U+1F1F7",
        "phone_length": 10
    },
    {
        "name": "Greenland",
        "iso3": "GRL",
        "iso2": "GL",
        "phone_code": "+299",
        "emoji": "🇬🇱",
        "emoji_code": "U+1F1EC U+1F1F1",
        "phone_length": 6
    },
    {
        "name": "Grenada",
        "iso3": "GRD",
        "iso2": "GD",
        "phone_code": "+1-473",
        "emoji": "🇬🇩",
        "emoji_code": "U+1F1EC U+1F1E9",
        "phone_length": 10
    },
    {
        "name": "Guadeloupe",
        "iso3": "GLP",
        "iso2": "GP",
        "phone_code": "+590",
        "emoji": "🇬🇵",
        "emoji_code": "U+1F1EC U+1F1F5",
        "phone_length": 9
    },
    {
        "name": "Guam",
        "iso3": "GUM",
        "iso2": "GU",
        "phone_code": "+1-671",
        "emoji": "🇬🇺",
        "emoji_code": "U+1F1EC U+1F1FA",
        "phone_length": 10
    },
    {
        "name": "Guatemala",
        "iso3": "GTM",
        "iso2": "GT",
        "phone_code": "+502",
        "emoji": "🇬🇹",
        "emoji_code": "U+1F1EC U+1F1F9",
        "phone_length": 8
    },
    {
        "name": "Guernsey and Alderney",
        "iso3": "GGY",
        "iso2": "GG",
        "phone_code": "+44-1481",
        "emoji": "🇬🇬",
        "emoji_code": "U+1F1EC U+1F1EC",
        "phone_length": 10
    },
    {
        "name": "Honduras",
        "iso3": "HND",
        "iso2": "HN",
        "phone_code": "+504",
        "emoji": "🇭🇳",
        "emoji_code": "U+1F1ED U+1F1F3",
        "phone_length": 8
    },
    {
        "name": "Hong Kong S.A.R.",
        "iso3": "HKG",
        "iso2": "HK",
        "phone_code": "+852",
        "emoji": "🇭🇰",
        "emoji_code": "U+1F1ED U+1F1F0",
        "phone_length": 8
    },
    {
        "name": "Hungary",
        "iso3": "HUN",
        "iso2": "HU",
        "phone_code": "+36",
        "emoji": "🇭🇺",
        "emoji_code": "U+1F1ED U+1F1FA",
        "phone_length": 9
    },
    {
        "name": "India",
        "iso3": "IND",
        "iso2": "IN",
        "phone_code": "+91",
        "emoji": "🇮🇳",
        "emoji_code": "U+1F1EE U+1F1F3",
        "phone_length": 10
    },
    {
        "name": "Indonesia",
        "iso3": "IDN",
        "iso2": "ID",
        "phone_code": "+62",
        "emoji": "🇮🇩",
        "emoji_code": "U+1F1EE U+1F1E9",
        "phone_length": 9
    },
    {
        "name": "Iran",
        "iso3": "IRN",
        "iso2": "IR",
        "phone_code": "+98",
        "emoji": "🇮🇷",
        "emoji_code": "U+1F1EE U+1F1F7",
        "phone_length": 10
    },
    {
        "name": "Ireland",
        "iso3": "IRL",
        "iso2": "IE",
        "phone_code": "+353",
        "emoji": "🇮🇪",
        "emoji_code": "U+1F1EE U+1F1EA",
        "phone_length": 9
    },
    {
        "name": "Israel",
        "iso3": "ISR",
        "iso2": "IL",
        "phone_code": "+972",
        "emoji": "🇮🇱",
        "emoji_code": "U+1F1EE U+1F1F1",
        "phone_length": 9
    },
    {
        "name": "Italy",
        "iso3": "ITA",
        "iso2": "IT",
        "phone_code": "+39",
        "emoji": "🇮🇹",
        "emoji_code": "U+1F1EE U+1F1F9",
        "phone_length": 10
    },
    {
        "name": "Jamaica",
        "iso3": "JAM",
        "iso2": "JM",
        "phone_code": "+1-876",
        "emoji": "🇯🇲",
        "emoji_code": "U+1F1EF U+1F1F2",
        "phone_length": 10
    },
    {
        "name": "Japan",
        "iso3": "JPN",
        "iso2": "JP",
        "phone_code": "+81",
        "emoji": "🇯🇵",
        "emoji_code": "U+1F1EF U+1F1F5",
        "phone_length": 10
    },
    {
        "name": "Jordan",
        "iso3": "JOR",
        "iso2": "JO",
        "phone_code": "+962",
        "emoji": "🇯🇴",
        "emoji_code": "U+1F1EF U+1F1F4",
        "phone_length": 9
    },
    {
        "name": "Kazakhstan",
        "iso3": "KAZ",
        "iso2": "KZ",
        "phone_code": "+7",
        "emoji": "🇰🇿",
        "emoji_code": "U+1F1F0 U+1F1FF",
        "phone_length": 10
    },
    {
        "name": "Kenya",
        "iso3": "KEN",
        "iso2": "KE",
        "phone_code": "+254",
        "emoji": "🇰🇪",
        "emoji_code": "U+1F1F0 U+1F1EA",
        "phone_length": 10
    },
    {
        "name": "Kiribati",
        "iso3": "KIR",
        "iso2": "KI",
        "phone_code": "+686",
        "emoji": "🇰🇮",
        "emoji_code": "U+1F1F0 U+1F1EE",
        "phone_length": 8
    },
    {
        "name": "Kuwait",
        "iso3": "KWT",
        "iso2": "KW",
        "phone_code": "+965",
        "emoji": "🇰🇼",
        "emoji_code": "U+1F1F0 U+1F1FC",
        "phone_length": 8
    },
    {
        "name": "Latvia",
        "iso3": "LVA",
        "iso2": "LV",
        "phone_code": "+371",
        "emoji": "🇱🇻",
        "emoji_code": "U+1F1F1 U+1F1FB",
        "phone_length": 8
    },
    {
        "name": "Lebanon",
        "iso3": "LBN",
        "iso2": "LB",
        "phone_code": "+961",
        "emoji": "🇱🇧",
        "emoji_code": "U+1F1F1 U+1F1E7",
        "phone_length": 7
    },
    {
        "name": "Liberia",
        "iso3": "LBR",
        "iso2": "LR",
        "phone_code": "+231",
        "emoji": "🇱🇷",
        "emoji_code": "U+1F1F1 U+1F1F7",
        "phone_length": 7
    },
    {
        "name": "Libya",
        "iso3": "LBY",
        "iso2": "LY",
        "phone_code": "+218",
        "emoji": "🇱🇾",
        "emoji_code": "U+1F1F1 U+1F1FE",
        "phone_length": 10
    },
    {
        "name": "Lithuania",
        "iso3": "LTU",
        "iso2": "LT",
        "phone_code": "+370",
        "emoji": "🇱🇹",
        "emoji_code": "U+1F1F1 U+1F1F9",
        "phone_length": 8
    },
    {
        "name": "Luxembourg",
        "iso3": "LUX",
        "iso2": "LU",
        "phone_code": "+352",
        "emoji": "🇱🇺",
        "emoji_code": "U+1F1F1 U+1F1FA",
        "phone_length": 9
    },
    {
        "name": "Malaysia",
        "iso3": "MYS",
        "iso2": "MY",
        "phone_code": "+60",
        "emoji": "🇲🇾",
        "emoji_code": "U+1F1F2 U+1F1FE",
        "phone_length": 7
    },
    {
        "name": "Maldives",
        "iso3": "MDV",
        "iso2": "MV",
        "phone_code": "+960",
        "emoji": "🇲🇻",
        "emoji_code": "U+1F1F2 U+1F1FB",
        "phone_length": 7
    },
    {
        "name": "Mali",
        "iso3": "MLI",
        "iso2": "ML",
        "phone_code": "+223",
        "emoji": "🇲🇱",
        "emoji_code": "U+1F1F2 U+1F1F1",
        "phone_length": 8
    },
    {
        "name": "Malta",
        "iso3": "MLT",
        "iso2": "MT",
        "phone_code": "+356",
        "emoji": "🇲🇹",
        "emoji_code": "U+1F1F2 U+1F1F9",
        "phone_length": 8
    },
    {
        "name": "Man (Isle of)",
        "iso3": "IMN",
        "iso2": "IM",
        "phone_code": "+44-1624",
        "emoji": "🇮🇲",
        "emoji_code": "U+1F1EE U+1F1F2",
        "phone_length": 10
    },
    {
        "name": "Marshall Islands",
        "iso3": "MHL",
        "iso2": "MH",
        "phone_code": "+692",
        "emoji": "🇲🇭",
        "emoji_code": "U+1F1F2 U+1F1ED",
        "phone_length": 7
    },
    {
        "name": "Martinique",
        "iso3": "MTQ",
        "iso2": "MQ",
        "phone_code": "+596",
        "emoji": "🇲🇶",
        "emoji_code": "U+1F1F2 U+1F1F6",
        "phone_length": 9
    },
    {
        "name": "Mauritius",
        "iso3": "MUS",
        "iso2": "MU",
        "phone_code": "+230",
        "emoji": "🇲🇺",
        "emoji_code": "U+1F1F2 U+1F1FA",
        "phone_length": 8
    },
    {
        "name": "Mexico",
        "iso3": "MEX",
        "iso2": "MX",
        "phone_code": "+52",
        "emoji": "🇲🇽",
        "emoji_code": "U+1F1F2 U+1F1FD",
        "phone_length": 10
    },
    {
        "name": "Micronesia",
        "iso3": "FSM",
        "iso2": "FM",
        "phone_code": "+691",
        "emoji": "🇫🇲",
        "emoji_code": "U+1F1EB U+1F1F2",
        "phone_length": 7
    },
    {
        "name": "Moldova",
        "iso3": "MDA",
        "iso2": "MD",
        "phone_code": "+373",
        "emoji": "🇲🇩",
        "emoji_code": "U+1F1F2 U+1F1E9",
        "phone_length": 8
    },
    {
        "name": "Montenegro",
        "iso3": "MNE",
        "iso2": "ME",
        "phone_code": "+382",
        "emoji": "🇲🇪",
        "emoji_code": "U+1F1F2 U+1F1EA",
        "phone_length": 8
    },
    {
        "name": "Montserrat",
        "iso3": "MSR",
        "iso2": "MS",
        "phone_code": "+1-664",
        "emoji": "🇲🇸",
        "emoji_code": "U+1F1F2 U+1F1F8",
        "phone_length": 10
    },
    {
        "name": "Mozambique",
        "iso3": "MOZ",
        "iso2": "MZ",
        "phone_code": "+258",
        "emoji": "🇲🇿",
        "emoji_code": "U+1F1F2 U+1F1FF",
        "phone_length": 12
    },
    {
        "name": "Myanmar",
        "iso3": "MMR",
        "iso2": "MM",
        "phone_code": "+95",
        "emoji": "🇲🇲",
        "emoji_code": "U+1F1F2 U+1F1F2",
        "phone_length": 8
    },
    {
        "name": "Nepal",
        "iso3": "NPL",
        "iso2": "NP",
        "phone_code": "+977",
        "emoji": "🇳🇵",
        "emoji_code": "U+1F1F3 U+1F1F5",
        "phone_length": 10
    },
    {
        "name": "Netherlands",
        "iso3": "NLD",
        "iso2": "NL",
        "phone_code": "+31",
        "emoji": "🇳🇱",
        "emoji_code": "U+1F1F3 U+1F1F1",
        "phone_length": 9
    },
    {
        "name": "New Caledonia",
        "iso3": "NCL",
        "iso2": "NC",
        "phone_code": "+687",
        "emoji": "🇳🇨",
        "emoji_code": "U+1F1F3 U+1F1E8",
        "phone_length": 6
    },
    {
        "name": "New Zealand",
        "iso3": "NZL",
        "iso2": "NZ",
        "phone_code": "+64",
        "emoji": "🇳🇿",
        "emoji_code": "U+1F1F3 U+1F1FF",
        "phone_length": 9
    },
    {
        "name": "Nicaragua",
        "iso3": "NIC",
        "iso2": "NI",
        "phone_code": "+505",
        "emoji": "🇳🇮",
        "emoji_code": "U+1F1F3 U+1F1EE",
        "phone_length": 8
    },
    {
        "name": "Niger",
        "iso3": "NER",
        "iso2": "NE",
        "phone_code": "+227",
        "emoji": "🇳🇪",
        "emoji_code": "U+1F1F3 U+1F1EA",
        "phone_length": 8
    },
    {
        "name": "Nigeria",
        "iso3": "NGA",
        "iso2": "NG",
        "phone_code": "+234",
        "emoji": "🇳🇬",
        "emoji_code": "U+1F1F3 U+1F1EC",
        "phone_length": 8
    },
    {
        "name": "Niue",
        "iso3": "NIU",
        "iso2": "NU",
        "phone_code": "+683",
        "emoji": "🇳🇺",
        "emoji_code": "U+1F1F3 U+1F1FA",
        "phone_length": 4
    },
    {
        "name": "North Macedonia",
        "iso3": "MKD",
        "iso2": "MK",
        "phone_code": "+389",
        "emoji": "🇲🇰",
        "emoji_code": "U+1F1F2 U+1F1F0",
        "phone_length": 8
    },
    {
        "name": "Northern Mariana Islands",
        "iso3": "MNP",
        "iso2": "MP",
        "phone_code": "+1-670",
        "emoji": "🇲🇵",
        "emoji_code": "U+1F1F2 U+1F1F5",
        "phone_length": 10
    },
    {
        "name": "Norway",
        "iso3": "NOR",
        "iso2": "NO",
        "phone_code": "+47",
        "emoji": "🇳🇴",
        "emoji_code": "U+1F1F3 U+1F1F4",
        "phone_length": 8
    },
    {
        "name": "Oman",
        "iso3": "OMN",
        "iso2": "OM",
        "phone_code": "+968",
        "emoji": "🇴🇲",
        "emoji_code": "U+1F1F4 U+1F1F2",
        "phone_length": 8
    },
    {
        "name": "Pakistan",
        "iso3": "PAK",
        "iso2": "PK",
        "phone_code": "+92",
        "emoji": "🇵🇰",
        "emoji_code": "U+1F1F5 U+1F1F0",
        "phone_length": 10
    },
    {
        "name": "Palau",
        "iso3": "PLW",
        "iso2": "PW",
        "phone_code": "+680",
        "emoji": "🇵🇼",
        "emoji_code": "U+1F1F5 U+1F1FC",
        "phone_length": 7
    },
    {
        "name": "Panama",
        "iso3": "PAN",
        "iso2": "PA",
        "phone_code": "+507",
        "emoji": "🇵🇦",
        "emoji_code": "U+1F1F5 U+1F1E6",
        "phone_length": 8
    },
    {
        "name": "Paraguay",
        "iso3": "PRY",
        "iso2": "PY",
        "phone_code": "+595",
        "emoji": "🇵🇾",
        "emoji_code": "U+1F1F5 U+1F1FE",
        "phone_length": 9
    },
    {
        "name": "Peru",
        "iso3": "PER",
        "iso2": "PE",
        "phone_code": "+51",
        "emoji": "🇵🇪",
        "emoji_code": "U+1F1F5 U+1F1EA",
        "phone_length": 9
    },
    {
        "name": "Philippines",
        "iso3": "PHL",
        "iso2": "PH",
        "phone_code": "+63",
        "emoji": "🇵🇭",
        "emoji_code": "U+1F1F5 U+1F1ED",
        "phone_length": 10
    },
    {
        "name": "Poland",
        "iso3": "POL",
        "iso2": "PL",
        "phone_code": "+48",
        "emoji": "🇵🇱",
        "emoji_code": "U+1F1F5 U+1F1F1",
        "phone_length": 9
    },
    {
        "name": "Portugal",
        "iso3": "PRT",
        "iso2": "PT",
        "phone_code": "+351",
        "emoji": "🇵🇹",
        "emoji_code": "U+1F1F5 U+1F1F9",
        "phone_length": 9
    },
    {
        "name": "Puerto Rico",
        "iso3": "PRI",
        "iso2": "PR",
        "phone_code": "+1-787",
        "emoji": "🇵🇷",
        "emoji_code": "U+1F1F5 U+1F1F7",
        "phone_length": 10
    },
    {
        "name": "Qatar",
        "iso3": "QAT",
        "iso2": "QA",
        "phone_code": "+974",
        "emoji": "🇶🇦",
        "emoji_code": "U+1F1F6 U+1F1E6",
        "phone_length": 8
    },
    {
        "name": "Romania",
        "iso3": "ROU",
        "iso2": "RO",
        "phone_code": "+40",
        "emoji": "🇷🇴",
        "emoji_code": "U+1F1F7 U+1F1F4",
        "phone_length": 10
    },
    {
        "name": "Russia",
        "iso3": "RUS",
        "iso2": "RU",
        "phone_code": "+7",
        "emoji": "🇷🇺",
        "emoji_code": "U+1F1F7 U+1F1FA",
        "phone_length": 10
    },
    {
        "name": "Saint Kitts And Nevis",
        "iso3": "KNA",
        "iso2": "KN",
        "phone_code": "+1-869",
        "emoji": "🇰🇳",
        "emoji_code": "U+1F1F0 U+1F1F3",
        "phone_length": 10
    },
    {
        "name": "Saint Lucia",
        "iso3": "LCA",
        "iso2": "LC",
        "phone_code": "+1-758",
        "emoji": "🇱🇨",
        "emoji_code": "U+1F1F1 U+1F1E8",
        "phone_length": 10
    },
    {
        "name": "Saint Vincent And The Grenadines",
        "iso3": "VCT",
        "iso2": "VC",
        "phone_code": "+1-784",
        "emoji": "🇻🇨",
        "emoji_code": "U+1F1FB U+1F1E8",
        "phone_length": 10
    },
    {
        "name": "Samoa",
        "iso3": "WSM",
        "iso2": "WS",
        "phone_code": "+685",
        "emoji": "🇼🇸",
        "emoji_code": "U+1F1FC U+1F1F8",
        "phone_length": 5
    },
    {
        "name": "Saudi Arabia",
        "iso3": "SAU",
        "iso2": "SA",
        "phone_code": "+966",
        "emoji": "🇸🇦",
        "emoji_code": "U+1F1F8 U+1F1E6",
        "phone_length": 9
    },
    {
        "name": "Serbia",
        "iso3": "SRB",
        "iso2": "RS",
        "phone_code": "+381",
        "emoji": "🇷🇸",
        "emoji_code": "U+1F1F7 U+1F1F8",
        "phone_length": 8
    },
    {
        "name": "Singapore",
        "iso3": "SGP",
        "iso2": "SG",
        "phone_code": "+65",
        "emoji": "🇸🇬",
        "emoji_code": "U+1F1F8 U+1F1EC",
        "phone_length": 8
    },
    {
        "name": "Sint Maarten (Dutch part)",
        "iso3": "SXM",
        "iso2": "SX",
        "phone_code": "+1721",
        "emoji": "🇸🇽",
        "emoji_code": "U+1F1F8 U+1F1FD",
        "phone_length": 10
    },
    {
        "name": "Slovakia",
        "iso3": "SVK",
        "iso2": "SK",
        "phone_code": "+421",
        "emoji": "🇸🇰",
        "emoji_code": "U+1F1F8 U+1F1F0",
        "phone_length": 9
    },
    {
        "name": "Solomon Islands",
        "iso3": "SLB",
        "iso2": "SB",
        "phone_code": "+677",
        "emoji": "🇸🇧",
        "emoji_code": "U+1F1F8 U+1F1E7",
        "phone_length": 7
    },
    {
        "name": "Somalia",
        "iso3": "SOM",
        "iso2": "SO",
        "phone_code": "+252",
        "emoji": "🇸🇴",
        "emoji_code": "U+1F1F8 U+1F1F4",
        "phone_length": 8
    },
    {
        "name": "South Africa",
        "iso3": "ZAF",
        "iso2": "ZA",
        "phone_code": "+27",
        "emoji": "🇿🇦",
        "emoji_code": "U+1F1FF U+1F1E6",
        "phone_length": 9
    },
    {
        "name": "South Korea",
        "iso3": "KOR",
        "iso2": "KR",
        "phone_code": "+82",
        "emoji": "🇰🇷",
        "emoji_code": "U+1F1F0 U+1F1F7",
        "phone_length": 10
    },
    {
        "name": "Spain",
        "iso3": "ESP",
        "iso2": "ES",
        "phone_code": "+34",
        "emoji": "🇪🇸",
        "emoji_code": "U+1F1EA U+1F1F8",
        "phone_length": 9
    },
    {
        "name": "Sri Lanka",
        "iso3": "LKA",
        "iso2": "LK",
        "phone_code": "+94",
        "emoji": "🇱🇰",
        "emoji_code": "U+1F1F1 U+1F1F0",
        "phone_length": 7
    },
    {
        "name": "Sweden",
        "iso3": "SWE",
        "iso2": "SE",
        "phone_code": "+46",
        "emoji": "🇸🇪",
        "emoji_code": "U+1F1F8 U+1F1EA",
        "phone_length": 7
    },
    {
        "name": "Switzerland",
        "iso3": "CHE",
        "iso2": "CH",
        "phone_code": "+41",
        "emoji": "🇨🇭",
        "emoji_code": "U+1F1E8 U+1F1ED",
        "phone_length": 9
    },
    {
        "name": "Syria",
        "iso3": "SYR",
        "iso2": "SY",
        "phone_code": "+963",
        "emoji": "🇸🇾",
        "emoji_code": "U+1F1F8 U+1F1FE",
        "phone_length": 9
    },
    {
        "name": "Taiwan",
        "iso3": "TWN",
        "iso2": "TW",
        "phone_code": "+886",
        "emoji": "🇹🇼",
        "emoji_code": "U+1F1F9 U+1F1FC",
        "phone_length": 9
    },
    {
        "name": "Tanzania",
        "iso3": "TZA",
        "iso2": "TZ",
        "phone_code": "+255",
        "emoji": "🇹🇿",
        "emoji_code": "U+1F1F9 U+1F1FF",
        "phone_length": 6
    },
    {
        "name": "Thailand",
        "iso3": "THA",
        "iso2": "TH",
        "phone_code": "+66",
        "emoji": "🇹🇭",
        "emoji_code": "U+1F1F9 U+1F1ED",
        "phone_length": 9
    },
    {
        "name": "The Bahamas",
        "iso3": "BHS",
        "iso2": "BS",
        "phone_code": "+1-242",
        "emoji": "🇧🇸",
        "emoji_code": "U+1F1E7 U+1F1F8",
        "phone_length": 10
    },
    {
        "name": "Togo",
        "iso3": "TGO",
        "iso2": "TG",
        "phone_code": "+228",
        "emoji": "🇹🇬",
        "emoji_code": "U+1F1F9 U+1F1EC",
        "phone_length": 8
    },
    {
        "name": "Trinidad And Tobago",
        "iso3": "TTO",
        "iso2": "TT",
        "phone_code": "+1-868",
        "emoji": "🇹🇹",
        "emoji_code": "U+1F1F9 U+1F1F9",
        "phone_length": 10
    },
    {
        "name": "Tunisia",
        "iso3": "TUN",
        "iso2": "TN",
        "phone_code": "+216",
        "emoji": "🇹🇳",
        "emoji_code": "U+1F1F9 U+1F1F3",
        "phone_length": 8
    },
    {
        "name": "Turkey",
        "iso3": "TUR",
        "iso2": "TR",
        "phone_code": "+90",
        "emoji": "🇹🇷",
        "emoji_code": "U+1F1F9 U+1F1F7",
        "phone_length": 10
    },
    {
        "name": "Turks And Caicos Islands",
        "iso3": "TCA",
        "iso2": "TC",
        "phone_code": "+1-649",
        "emoji": "🇹🇨",
        "emoji_code": "U+1F1F9 U+1F1E8",
        "phone_length": 10
    },
    {
        "name": "Ukraine",
        "iso3": "UKR",
        "iso2": "UA",
        "phone_code": "+380",
        "emoji": "🇺🇦",
        "emoji_code": "U+1F1FA U+1F1E6",
        "phone_length": 9
    },
    {
        "name": "United Arab Emirates",
        "iso3": "ARE",
        "iso2": "AE",
        "phone_code": "+971",
        "emoji": "🇦🇪",
        "emoji_code": "U+1F1E6 U+1F1EA",
        "phone_length": 9
    },
    {
        "name": "United Kingdom",
        "iso3": "GBR",
        "iso2": "GB",
        "phone_code": "+44",
        "emoji": "🇬🇧",
        "emoji_code": "U+1F1EC U+1F1E7",
        "phone_length": 10
    },
    {
        "name": "United States",
        "iso3": "USA",
        "iso2": "US",
        "phone_code": "+1",
        "emoji": "🇺🇸",
        "emoji_code": "U+1F1FA U+1F1F8",
        "phone_length": 10
    },
    {
        "name": "Vatican City State (Holy See)",
        "iso3": "VAT",
        "iso2": "VA",
        "phone_code": "+379",
        "emoji": "🇻🇦",
        "emoji_code": "U+1F1FB U+1F1E6",
        "phone_length": 10
    },
    {
        "name": "Venezuela",
        "iso3": "VEN",
        "iso2": "VE",
        "phone_code": "+58",
        "emoji": "🇻🇪",
        "emoji_code": "U+1F1FB U+1F1EA",
        "phone_length": 7
    },
    {
        "name": "Vietnam",
        "iso3": "VNM",
        "iso2": "VN",
        "phone_code": "+84",
        "emoji": "🇻🇳",
        "emoji_code": "U+1F1FB U+1F1F3",
        "phone_length": 9
    },
    {
        "name": "Virgin Islands (British)",
        "iso3": "VGB",
        "iso2": "VG",
        "phone_code": "+1-284",
        "emoji": "🇻🇬",
        "emoji_code": "U+1F1FB U+1F1EC",
        "phone_length": 10
    },
    {
        "name": "Virgin Islands (US)",
        "iso3": "VIR",
        "iso2": "VI",
        "phone_code": "+1-340",
        "emoji": "🇻🇮",
        "emoji_code": "U+1F1FB U+1F1EE",
        "phone_length": 10
    },
    {
        "name": "Yemen",
        "iso3": "YEM",
        "iso2": "YE",
        "phone_code": "+967",
        "emoji": "🇾🇪",
        "emoji_code": "U+1F1FE U+1F1EA",
        "phone_length": 9
    },
    {
        "name": "Zambia",
        "iso3": "ZMB",
        "iso2": "ZM",
        "phone_code": "+260",
        "emoji": "🇿🇲",
        "emoji_code": "U+1F1FF U+1F1F2",
        "phone_length": 9
    },
    {
        "name": "Zimbabwe",
        "iso3": "ZWE",
        "iso2": "ZW",
        "phone_code": "+263",
        "emoji": "🇿🇼",
        "emoji_code": "U+1F1FF U+1F1FC",
        "phone_length": 9
    }
]

const seedDb = async () => {
    await phone.deleteMany({});
    await phone.insertMany(seedAdmin);
};

seedDb().then(() => {
    mongoose.connection.close();
});
