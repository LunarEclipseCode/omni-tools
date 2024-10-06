import React, { Component } from "react";
import { DateTime } from "luxon";
import { CopyIcon } from "../others/Icons";
import { CustomScrollbar } from "../others/CustomScrollbar";

const timeZones = [
  { label: "(UTC-12:00) Dateline Standard Time", value: "Etc/GMT+12" },
  { label: "(UTC-11:00) UTC-11", value: "Etc/GMT+11" },
  { label: "(UTC-10:00) Aleutian Standard Time", value: "America/Adak" },
  { label: "(UTC-10:00) Hawaiian Standard Time", value: "Pacific/Honolulu" },
  { label: "(UTC-09:30) Marquesas Standard Time", value: "Pacific/Marquesas" },
  { label: "(UTC-09:00) Alaskan Standard Time", value: "America/Anchorage" },
  { label: "(UTC-09:00) UTC-09", value: "Etc/GMT+9" },
  { label: "(UTC-08:00) Pacific Standard Time", value: "America/Los_Angeles" },
  { label: "(UTC-08:00) Pacific Standard Time (Mexico)", value: "America/Tijuana" },
  { label: "(UTC-08:00) UTC-08", value: "Etc/GMT+8" },
  { label: "(UTC-07:00) Mountain Standard Time", value: "America/Denver" },
  { label: "(UTC-07:00) Mountain Standard Time (Mexico)", value: "America/Hermosillo" },
  { label: "(UTC-07:00) US Mountain Standard Time", value: "America/Phoenix" },
  { label: "(UTC-07:00) Yukon Standard Time", value: "America/Whitehorse" },
  { label: "(UTC-06:00) Canada Central Standard Time", value: "America/Regina" },
  { label: "(UTC-06:00) Central America Standard Time", value: "America/Guatemala" },
  { label: "(UTC-06:00) Central Standard Time", value: "America/Chicago" },
  { label: "(UTC-06:00) Central Standard Time (Mexico)", value: "America/Mexico_City" },
  { label: "(UTC-06:00) Easter Island Standard Time", value: "Pacific/Easter" },
  { label: "(UTC-05:00) Cuba Standard Time", value: "America/Havana" },
  { label: "(UTC-05:00) Eastern Standard Time", value: "America/New_York" },
  { label: "(UTC-05:00) Eastern Standard Time (Mexico)", value: "America/Cancun" },
  { label: "(UTC-05:00) Haiti Standard Time", value: "America/Port-au-Prince" },
  { label: "(UTC-05:00) SA Pacific Standard Time", value: "America/Bogota" },
  { label: "(UTC-05:00) Turks and Caicos Standard Time", value: "America/Grand_Turk" },
  { label: "(UTC-05:00) US Eastern Standard Time", value: "America/Indianapolis" },
  { label: "(UTC-04:00) Atlantic Standard Time", value: "America/Halifax" },
  { label: "(UTC-04:00) Central Brazilian Standard Time", value: "America/Cuiaba" },
  { label: "(UTC-04:00) Pacific SA Standard Time", value: "America/Santiago" },
  { label: "(UTC-04:00) Paraguay Standard Time", value: "America/Asuncion" },
  { label: "(UTC-04:00) SA Western Standard Time", value: "America/La_Paz" },
  { label: "(UTC-04:00) Venezuela Standard Time", value: "America/Caracas" },
  { label: "(UTC-03:30) Newfoundland Standard Time", value: "America/St_Johns" },
  { label: "(UTC-03:00) Argentina Standard Time", value: "America/Argentina/Buenos_Aires" },
  { label: "(UTC-03:00) Bahia Standard Time", value: "America/Bahia" },
  { label: "(UTC-03:00) E. South America Standard Time", value: "America/Sao_Paulo" },
  { label: "(UTC-03:00) Magallanes Standard Time", value: "America/Punta_Arenas" },
  { label: "(UTC-03:00) Montevideo Standard Time", value: "America/Montevideo" },
  { label: "(UTC-03:00) SA Eastern Standard Time", value: "America/Cayenne" },
  { label: "(UTC-03:00) Saint Pierre Standard Time", value: "America/Miquelon" },
  { label: "(UTC-03:00) Tocantins Standard Time", value: "America/Araguaina" },
  { label: "(UTC-02:00) Greenland Standard Time", value: "America/Godthab" },
  { label: "(UTC-02:00) Mid-Atlantic Standard Time", value: "America/Noronha" },
  { label: "(UTC-02:00) UTC-02", value: "Etc/GMT+2" },
  { label: "(UTC-01:00) Azores Standard Time", value: "Atlantic/Azores" },
  { label: "(UTC-01:00) Cabo Verde Standard Time", value: "Atlantic/Cape_Verde" },
  { label: "(UTC) Coordinated Universal Time", value: "UTC" },
  { label: "(UTC+00:00) GMT Standard Time", value: "Europe/London" },
  { label: "(UTC+00:00) Greenwich Standard Time", value: "Atlantic/Reykjavik" },
  { label: "(UTC+00:00) Morocco Standard Time", value: "Africa/Casablanca" },
  { label: "(UTC+00:00) Sao Tome Standard Time", value: "Africa/Sao_Tome" },
  { label: "(UTC+01:00) Central Europe Standard Time", value: "Europe/Berlin" },
  { label: "(UTC+01:00) Central European Standard Time", value: "Europe/Warsaw" },
  { label: "(UTC+01:00) Romance Standard Time", value: "Europe/Paris" },
  { label: "(UTC+01:00) W. Central Africa Standard Time", value: "Africa/Lagos" },
  { label: "(UTC+01:00) W. Europe Standard Time", value: "Europe/Berlin" },
  { label: "(UTC+02:00) E. Europe Standard Time", value: "Europe/Bucharest" },
  { label: "(UTC+02:00) Egypt Standard Time", value: "Africa/Cairo" },
  { label: "(UTC+02:00) FLE Standard Time", value: "Europe/Kiev" },
  { label: "(UTC+02:00) GTB Standard Time", value: "Europe/Bucharest" },
  { label: "(UTC+02:00) Jerusalem Standard Time", value: "Asia/Jerusalem" },
  { label: "(UTC+02:00) Libya Standard Time", value: "Africa/Tripoli" },
  { label: "(UTC+02:00) Middle East Standard Time", value: "Asia/Beirut" },
  { label: "(UTC+02:00) Namibia Standard Time", value: "Africa/Windhoek" },
  { label: "(UTC+02:00) Russia TZ 1 Standard Time", value: "Europe/Moscow" },
  { label: "(UTC+02:00) South Africa Standard Time", value: "Africa/Johannesburg" },
  { label: "(UTC+02:00) South Sudan Standard Time", value: "Africa/Juba" },
  { label: "(UTC+02:00) Sudan Standard Time", value: "Africa/Khartoum" },
  { label: "(UTC+02:00) West Bank Gaza Standard Time", value: "Asia/Gaza" },
  { label: "(UTC+03:00) Arab Standard Time", value: "Asia/Riyadh" },
  { label: "(UTC+03:00) Arabic Standard Time", value: "Asia/Riyadh" },
  { label: "(UTC+03:00) Belarus Standard Time", value: "Europe/Minsk" },
  { label: "(UTC+03:00) E. Africa Standard Time", value: "Africa/Nairobi" },
  { label: "(UTC+03:00) Jordan Standard Time", value: "Asia/Amman" },
  { label: "(UTC+03:00) Russia TZ 2 Standard Time", value: "Europe/Moscow" },
  { label: "(UTC+03:00) Syria Standard Time", value: "Asia/Damascus" },
  { label: "(UTC+03:00) Turkey Standard Time", value: "Europe/Istanbul" },
  { label: "(UTC+03:00) Volgograd Standard Time", value: "Europe/Volgograd" },
  { label: "(UTC+03:30) Iran Standard Time", value: "Asia/Tehran" },
  { label: "(UTC+04:00) Arabian Standard Time", value: "Asia/Dubai" },
  { label: "(UTC+04:00) Astrakhan Standard Time", value: "Europe/Astrakhan" },
  { label: "(UTC+04:00) Azerbaijan Standard Time", value: "Asia/Baku" },
  { label: "(UTC+04:00) Caucasus Standard Time", value: "Asia/Yerevan" },
  { label: "(UTC+04:00) Georgian Standard Time", value: "Asia/Tbilisi" },
  { label: "(UTC+04:00) Mauritius Standard Time", value: "Indian/Mauritius" },
  { label: "(UTC+04:00) Russia TZ 3 Standard Time", value: "Europe/Moscow" },
  { label: "(UTC+04:00) Saratov Standard Time", value: "Europe/Saratov" },
  { label: "(UTC+04:30) Afghanistan Standard Time", value: "Asia/Kabul" },
  { label: "(UTC+05:00) Pakistan Standard Time", value: "Asia/Karachi" },
  { label: "(UTC+05:00) Qyzylorda Standard Time", value: "Asia/Qyzylorda" },
  { label: "(UTC+05:00) Russia TZ 4 Standard Time", value: "Asia/Yekaterinburg" },
  { label: "(UTC+05:00) West Asia Standard Time", value: "Asia/Tashkent" },
  { label: "(UTC+05:30) India Standard Time", value: "Asia/Kolkata" },
  { label: "(UTC+05:30) Sri Lanka Standard Time", value: "Asia/Colombo" },
  { label: "(UTC+05:45) Nepal Standard Time", value: "Asia/Kathmandu" },
  { label: "(UTC+06:00) Bangladesh Standard Time", value: "Asia/Dhaka" },
  { label: "(UTC+06:00) Central Asia Standard Time", value: "Asia/Almaty" },
  { label: "(UTC+06:00) Omsk Standard Time", value: "Asia/Omsk" },
  { label: "(UTC+06:30) Myanmar Standard Time", value: "Asia/Rangoon" },
  { label: "(UTC+07:00) Altai Standard Time", value: "Asia/Barnaul" },
  { label: "(UTC+07:00) Novosibirsk Standard Time", value: "Asia/Novosibirsk" },
  { label: "(UTC+07:00) Russia TZ 6 Standard Time", value: "Asia/Krasnoyarsk" },
  { label: "(UTC+07:00) SE Asia Standard Time", value: "Asia/Bangkok" },
  { label: "(UTC+07:00) Tomsk Standard Time", value: "Asia/Tomsk" },
  { label: "(UTC+07:00) W. Mongolia Standard Time", value: "Asia/Hovd" },
  { label: "(UTC+08:00) China Standard Time", value: "Asia/Shanghai" },
  { label: "(UTC+08:00) Malay Peninsula Standard Time", value: "Asia/Kuala_Lumpur" },
  { label: "(UTC+08:00) Russia TZ 7 Standard Time", value: "Asia/Irkutsk" },
  { label: "(UTC+08:00) Taipei Standard Time", value: "Asia/Taipei" },
  { label: "(UTC+08:00) Ulaanbaatar Standard Time", value: "Asia/Ulaanbaatar" },
  { label: "(UTC+08:00) W. Australia Standard Time", value: "Australia/Perth" },
  { label: "(UTC+08:45) Aus Central W. Standard Time", value: "Australia/Eucla" },
  { label: "(UTC+09:00) Korea Standard Time", value: "Asia/Seoul" },
  { label: "(UTC+09:00) North Korea Standard Time", value: "Asia/Pyongyang" },
  { label: "(UTC+09:00) Russia TZ 8 Standard Time", value: "Asia/Yakutsk" },
  { label: "(UTC+09:00) Tokyo Standard Time", value: "Asia/Tokyo" },
  { label: "(UTC+09:00) Transbaikal Standard Time", value: "Asia/Chita" },
  { label: "(UTC+09:30) AUS Central Standard Time", value: "Australia/Darwin" },
  { label: "(UTC+09:30) Cen. Australia Standard Time", value: "Australia/Adelaide" },
  { label: "(UTC+10:00) AUS Eastern Standard Time", value: "Australia/Sydney" },
  { label: "(UTC+10:00) E. Australia Standard Time", value: "Australia/Brisbane" },
  { label: "(UTC+10:00) Russia TZ 9 Standard Time", value: "Asia/Vladivostok" },
  { label: "(UTC+10:00) Tasmania Standard Time", value: "Australia/Hobart" },
  { label: "(UTC+10:00) West Pacific Standard Time", value: "Pacific/Port_Moresby" },
  { label: "(UTC+10:30) Lord Howe Standard Time", value: "Australia/Lord_Howe" },
  { label: "(UTC+11:00) Bougainville Standard Time", value: "Pacific/Bougainville" },
  { label: "(UTC+11:00) Central Pacific Standard Time", value: "Pacific/Guadalcanal" },
  { label: "(UTC+11:00) Magadan Standard Time", value: "Asia/Magadan" },
  { label: "(UTC+11:00) Norfolk Standard Time", value: "Pacific/Norfolk" },
  { label: "(UTC+11:00) Russia TZ 10 Standard Time", value: "Asia/Srednekolymsk" },
  { label: "(UTC+11:00) Sakhalin Standard Time", value: "Asia/Sakhalin" },
  { label: "(UTC+12:00) Fiji Standard Time", value: "Pacific/Fiji" },
  { label: "(UTC+12:00) Kamchatka Standard Time", value: "Asia/Kamchatka" },
  { label: "(UTC+12:00) New Zealand Standard Time", value: "Pacific/Auckland" },
  { label: "(UTC+12:00) Russia TZ 11 Standard Time", value: "Asia/Kamchatka" },
  { label: "(UTC+12:00) UTC+12", value: "Etc/GMT-12" },
  { label: "(UTC+12:45) Chatham Islands Standard Time", value: "Pacific/Chatham" },
  { label: "(UTC+13:00) Samoa Standard Time", value: "Pacific/Apia" },
  { label: "(UTC+13:00) Tonga Standard Time", value: "Pacific/Tongatapu" },
  { label: "(UTC+13:00) UTC+13", value: "Etc/GMT-13" },
  { label: "(UTC+14:00) Line Islands Standard Time", value: "Pacific/Kiritimati" },
];

const errorFields = ["timestamp", "iso", "year", "month", "day", "hours", "minutes", "seconds", "milliseconds"];

class DateConverter extends Component {
  constructor(props) {
    super(props);

    // Detect user's current time zone
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // Check if user's time zone is in the list
    const initialTimeZone = timeZones.find((tz) => tz.value === userTimeZone) ? userTimeZone : "UTC";

    const initialDateTime = DateTime.now().setZone(initialTimeZone);

    this.state = {
      timeZone: initialTimeZone,
      format: "milliseconds", // Default format
      dateTime: initialDateTime,
      inputs: {
        timestamp: initialDateTime.toMillis().toString(),
        iso: initialDateTime.toISO(),
        year: initialDateTime.year.toString(),
        month: initialDateTime.month.toString(),
        day: initialDateTime.day.toString(),
        hours: initialDateTime.hour.toString(),
        minutes: initialDateTime.minute.toString(),
        seconds: initialDateTime.second.toString(),
        milliseconds: initialDateTime.millisecond.toString(),
      },
      errors: errorFields.reduce((acc, field) => ({ ...acc, [field]: false }), {}),
      timestampErrorMessage: "",
      isoErrorMessage: "",
      editingField: null, // Tracks which field is currently being edited
      editingISO: false, // Specifically tracks if ISO field is being edited
    };
  }

  // Define maximum digits based on the selected format
  getMaxDigits = (format) => {
    switch (format) {
      case "ticks":
        return 19;
      case "milliseconds":
        return 13;
      case "seconds":
        return 10;
      default:
        return 13;
    }
  };

  // Convert DateTime to Ticks (Windows file time)
  convertToTicks(dateTime) {
    // Ticks are 100ns intervals since 0001-01-01T00:00:00Z
    const epoch = DateTime.fromISO("0001-01-01T00:00:00Z", { zone: "utc" });
    const diffInMilliseconds = dateTime.toUTC().diff(epoch, "milliseconds").milliseconds;
    const ticks = diffInMilliseconds * 10000;
    return ticks;
  }

  // Convert Ticks to DateTime
  convertFromTicks(ticks) {
    const epoch = DateTime.fromISO("0001-01-01T00:00:00Z", { zone: "utc" });
    const dateTime = epoch.plus({ milliseconds: ticks / 10000 });
    return dateTime;
  }

  resetISOError = () => {
    if (this.state.errors.iso) {
      this.setState({
        errors: {
          ...this.state.errors,
          iso: false,
        },
        isoErrorMessage: "",
      });
    }
  };

  handleTimeZoneChange = (e) => {
    const newTimeZone = e.target.value;
    const { dateTime } = this.state;

    const updatedDateTime = dateTime.setZone(newTimeZone);
    this.setState({
      timeZone: newTimeZone,
      dateTime: updatedDateTime,
      inputs: {
        ...this.state.inputs,
        timestamp: this.getTimestampFromDateTime(updatedDateTime),
        iso: updatedDateTime.toISO(),
        year: updatedDateTime.year.toString(),
        month: updatedDateTime.month.toString(),
        day: updatedDateTime.day.toString(),
        hours: updatedDateTime.hour.toString(),
        minutes: updatedDateTime.minute.toString(),
        seconds: updatedDateTime.second.toString(),
        milliseconds: updatedDateTime.millisecond.toString(),
      },
      errors: {
        ...this.state.errors,
        timestamp: false,
        iso: false,
      },
      timestampErrorMessage: "", // Reset timestamp error message
      isoErrorMessage: "", // Reset ISO error message
    });
  };

  handleFormatChange = (e) => {
    const newFormat = e.target.value;
    const { dateTime } = this.state;
    this.setState(
      {
        format: newFormat,
        inputs: {
          ...this.state.inputs,
          timestamp: this.getTimestampFromDateTime(dateTime, newFormat),
          iso: dateTime.toISO(),
        },
        errors: {
          ...this.state.errors,
          timestamp: false,
          iso: false,
        },
        timestampErrorMessage: "",
        isoErrorMessage: "",
      },
      () => {}
    );
  };

  // Helper method to get timestamp based on current format
  getTimestampFromDateTime = (dateTime, format = this.state.format) => {
    switch (format) {
      case "ticks":
        return this.convertToTicks(dateTime).toString();
      case "milliseconds":
        return dateTime.toMillis().toString();
      case "seconds":
        return Math.floor(dateTime.toSeconds()).toString();
      default:
        return dateTime.toMillis().toString();
    }
  };

  // Convert timestamp based on current format to DateTime
  parseTimestampToDateTime = (value, format) => {
    if (format === "iso") {
      const dateTime = DateTime.fromISO(value, { zone: this.state.timeZone });
      return dateTime.isValid ? dateTime : null;
    }

    const isNegative = value.startsWith("-");
    const numericValue = isNegative ? value.slice(1) : value;
    const num = parseInt(numericValue, 10);
    if (isNaN(num)) return null;
    switch (format) {
      case "ticks":
        return isNegative ? this.convertFromTicks(-num) : this.convertFromTicks(num);
      case "milliseconds":
        return isNegative ? DateTime.fromMillis(-num, { zone: this.state.timeZone }) : DateTime.fromMillis(num, { zone: this.state.timeZone });
      case "seconds":
        return isNegative ? DateTime.fromSeconds(-num, { zone: this.state.timeZone }) : DateTime.fromSeconds(num, { zone: this.state.timeZone });
      default:
        return DateTime.fromMillis(num, { zone: this.state.timeZone });
    }
  };

  handleTimestampChange = (e) => {
    const value = e.target.value;
    const { format } = this.state;
    const maxDigits = this.getMaxDigits(format);
    let errorMessage = "";

    if (value === "") {
      this.setState((prevState) => ({
        inputs: {
          ...prevState.inputs,
          timestamp: value,
          iso: "",
        },
        errors: {
          ...prevState.errors,
          timestamp: false,
          iso: false,
        },
        timestampErrorMessage: "",
        isoErrorMessage: "",
      }));
      return;
    }

    if (format !== "iso") {
      const isNegative = value.startsWith("-");
      const numericLength = isNegative ? value.length - 1 : value.length;
      if (numericLength > this.getMaxDigits(format)) {
        errorMessage = `Timestamp can be max ${this.getMaxDigits(format)} digits.`;
      }

      // Validate characters: optional leading hyphen followed by digits
      const regex = isNegative ? /^-\d*$/ : /^\d+$/;
      if (!regex.test(value)) {
        errorMessage = "Timestamp can only be a numerical value.";
      }

      if (errorMessage) {
        this.setState((prevState) => ({
          errors: {
            ...prevState.errors,
            timestamp: true,
          },
          timestampErrorMessage: errorMessage,
        }));
        return;
      }

      // Allow user to type just "-" without showing error
      if (isNegative && value === "-") {
        this.setState((prevState) => ({
          inputs: {
            ...prevState.inputs,
            timestamp: value,
          },
          errors: {
            ...prevState.errors,
            timestamp: false,
          },
          timestampErrorMessage: "",
        }));
        return;
      }

      // Parse the timestamp based on current format
      const newDateTime = this.parseTimestampToDateTime(value, format);
      if (!newDateTime || !newDateTime.isValid) {
        this.setState((prevState) => ({
          errors: {
            ...prevState.errors,
            timestamp: true,
          },
          timestampErrorMessage: "Invalid timestamp value.",
        }));
        return;
      }

      // Update state with new DateTime and reset errors
      this.setState({
        dateTime: newDateTime,
        inputs: {
          ...this.state.inputs,
          timestamp: value,
          iso: newDateTime.toISO(),
          year: newDateTime.year.toString(),
          month: newDateTime.month.toString(),
          day: newDateTime.day.toString(),
          hours: newDateTime.hour.toString(),
          minutes: newDateTime.minute.toString(),
          seconds: newDateTime.second.toString(),
          milliseconds: newDateTime.millisecond.toString(),
        },
        errors: {
          ...this.state.errors,
          timestamp: false,
          iso: false,
        },
        timestampErrorMessage: "",
        isoErrorMessage: "",
        editingISO: false, // Reset ISO editing if timestamp changes
      });
    }
  };

  handleISOChange = (e) => {};

  // Handle attempts to edit the ISO 8601 field
  handleISOKeyDown = (e) => {
    e.preventDefault();
    this.setState({
      errors: {
        ...this.state.errors,
        iso: true,
      },
      isoErrorMessage: "ISO 8601 field is not editable.",
    });
  };

  // Clear ISO error message on blur
  handleISOBlur = () => {
    this.setState({
      errors: {
        ...this.state.errors,
        iso: false,
      },
      isoErrorMessage: "",
    });
  };

  // Validate individual fields
  validateField = (field, value) => {
    switch (field) {
      case "year":
        return /^\d+$/.test(value) && parseInt(value, 10) >= 1;
      case "month":
        return /^\d+$/.test(value) && parseInt(value, 10) >= 1 && parseInt(value, 10) <= 12;
      case "day":
        return /^\d+$/.test(value) && parseInt(value, 10) >= 1 && parseInt(value, 10) <= 31;
      case "hours":
        return /^\d+$/.test(value) && parseInt(value, 10) >= 0 && parseInt(value, 10) <= 23;
      case "minutes":
        return /^\d+$/.test(value) && parseInt(value, 10) >= 0 && parseInt(value, 10) <= 59;
      case "seconds":
        return /^\d+$/.test(value) && parseInt(value, 10) >= 0 && parseInt(value, 10) <= 59;
      case "milliseconds":
        return /^\d+$/.test(value) && parseInt(value, 10) >= 0 && parseInt(value, 10) <= 999;
      default:
        return false;
    }
  };

  // Handle changes for individual date/time fields
  handleFieldChange = (field, value) => {
    const isValid = this.validateField(field, value);

    this.setState(
      (prevState) => ({
        inputs: {
          ...prevState.inputs,
          [field]: value,
        },
        errors: {
          ...prevState.errors,
          [field]: !isValid,
        },
      }),
      () => {
        const { errors, inputs, timeZone, format } = this.state;
        const subfieldErrors = ["year", "month", "day", "hours", "minutes", "seconds", "milliseconds"];
        const hasSubfieldErrors = subfieldErrors.some((field) => errors[field]);

        if (hasSubfieldErrors) {
          this.setState({
            dateTime: DateTime.invalid("Invalid date/time combination."),
            errors: {
              ...this.state.errors,
              timestamp: true,
            },
            timestampErrorMessage: "Invalid date/time combination.",
            isoErrorMessage: "",
          });
          return;
        }

        // Create a new DateTime object
        const newDateTime = DateTime.fromObject(
          {
            year: parseInt(inputs.year, 10),
            month: parseInt(inputs.month, 10),
            day: parseInt(inputs.day, 10),
            hour: parseInt(inputs.hours, 10),
            minute: parseInt(inputs.minutes, 10),
            second: parseInt(inputs.seconds, 10),
            millisecond: parseInt(inputs.milliseconds, 10),
          },
          { zone: timeZone }
        );

        if (!newDateTime.isValid) {
          // If the DateTime object is invalid, set errors
          this.setState({
            dateTime: DateTime.invalid("Invalid date/time combination."),
            errors: {
              ...this.state.errors,
              timestamp: true,
            },
            timestampErrorMessage: "Invalid date/time combination.",
            isoErrorMessage: "", // Clear ISO error
          });
        } else {
          // Update state with new DateTime and reset errors
          this.setState({
            dateTime: newDateTime,
            inputs: {
              ...this.state.inputs,
              timestamp: this.getTimestampFromDateTime(newDateTime),
              iso: newDateTime.toISO(),
            },
            errors: {
              ...this.state.errors,
              timestamp: false,
              iso: false,
            },
            timestampErrorMessage: "",
            isoErrorMessage: "",
            editingISO: false, // Reset ISO editing if date fields change
          });
        }
      }
    );
  };

  formatDate = () => {
    const { dateTime, format } = this.state;
    switch (format) {
      case "ticks":
        return this.convertToTicks(dateTime);
      case "milliseconds":
        return dateTime.toMillis();
      case "seconds":
        return Math.floor(dateTime.toSeconds());
      default:
        return dateTime.toMillis();
    }
  };

  copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  renderDropdown = (label, value, onChange, options) => {
    return (
      <>
        <style>
          {`
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
              height: 8px;
            }
  
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background-color: #4B5563;
              border-radius: 0.5rem;
            }
  
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background-color: #9CA3AF;
            }
  
            .custom-scrollbar::-webkit-scrollbar-track {
              background-color: #1F2937;
              border-radius: 0.5rem;
              border-top-right-radius: 1.2rem;
              border-bottom-right-radius: 1.2rem;
              background-clip: padding-box; /* Ensure no white space */
            }
  
            /* For Firefox */
            .custom-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: #4B5563 #1F2937;
            }
          `}
        </style>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-6 rounded-lg bg-gray-800 px-4 mb-0.5 p-2">
          <span className="text-white mb-2 md:mb-0 md:flex-1">{label}</span>
          <select value={value} onChange={onChange} className="h-10 w-full md:w-96 bg-gray-700 text-white px-2 rounded-lg custom-scrollbar">
            {options.map((tz, index) => {
              const offset = DateTime.now().setZone(tz.value).offset; // in minutes
              const hours = Math.floor(Math.abs(offset) / 60);
              const minutes = Math.abs(offset) % 60;
              const sign = offset >= 0 ? "+" : "-";
              const formattedOffset = `(UTC${sign}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}) ${tz.label.split(") ")[1]}`;
              return (
                <option key={index} className="bg-gray-800 text-gray-300" value={tz.value}>
                  {formattedOffset}
                </option>
              );
            })}
          </select>
        </div>
      </>
    );
  };

  renderInputField = (label, value, onChange, isValid = true, showCopyIcon = true, showError = true, customErrorMessage = null, maxLength = null, inputMode = "text", onFocus = null, onBlur = null, readOnly = false, onKeyDown = null) => {
    return (
      <section className="flex flex-col gap-2">
        <div className="flex justify-between">
          <h2 className="self-end text-lg text-gray-300">{label}</h2>
          {showCopyIcon && (
            <div className="flex">
              <button
                className={`text-gray-400 hover:text-white transition-colors mr-2 ${readOnly ? "cursor-not-allowed opacity-50" : ""}`}
                onClick={() => !readOnly && this.copyToClipboard(value)}
                aria-label={`Copy ${label}`}
                disabled={readOnly} // Disable copy if readOnly
              >
                <CopyIcon />
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <input
            className={`h-10 flex-grow bg-gray-800 px-4 py-2 text-white outline-none placeholder-gray-500 hover:bg-gray-700 focus:border-blue-400 focus:bg-gray-700 font-mono rounded-md border-b-2 ${isValid ? "border-gray-600" : "border-red-600"}`}
            spellCheck="false"
            value={value}
            onChange={onChange}
            inputMode={inputMode}
            maxLength={maxLength}
            onFocus={onFocus}
            onBlur={onBlur}
            readOnly={readOnly}
            onKeyDown={onKeyDown}
          />
          {!isValid && showError && <span className="text-red-500 text-base mt-1">{customErrorMessage || `Invalid ${label} value`}</span>}
        </div>
      </section>
    );
  };

  render() {
    const { timeZone, format, dateTime, errors, inputs, timestampErrorMessage, isoErrorMessage, editingField, editingISO } = this.state;

    // Determine if any subfield has errors
    const subfieldErrors = ["year", "month", "day", "hours", "minutes", "seconds", "milliseconds"];
    const hasSubfieldErrors = subfieldErrors.some((field) => errors[field]);

    // Only consider timestamp errors for derivedError
    const hasDateError = errors.timestamp;
    const derivedError = hasSubfieldErrors || hasDateError;

    const localDateTime = dateTime.setZone(timeZone);
    const formattedLocalDateTime = derivedError ? "N/A" : localDateTime.toFormat("dd MMM yyyy h:mm:ss a");

    const utcDateTime = dateTime.toUTC();
    const formattedUtcDateTime = derivedError ? "N/A" : utcDateTime.toFormat("dd MMM yyyy h:mm:ss a");

    const offset = localDateTime.offset; // in minutes
    const offsetHours = Math.floor(Math.abs(offset) / 60);
    const offsetMinutes = Math.abs(offset) % 60;
    const formattedOffset = `UTC${offset >= 0 ? "+" : "-"}${String(offsetHours).padStart(2, "0")}:${String(offsetMinutes).padStart(2, "0")}`;

    const displayOffset = derivedError ? "N/A" : `${formattedOffset}`;
    const displayLocalDateTime = derivedError ? "N/A" : formattedLocalDateTime;
    const displayUtcTicks = derivedError ? "N/A" : this.convertToTicks(dateTime);
    const displayUtcDateTime = derivedError ? "N/A" : formattedUtcDateTime;

    const isEditingTimestamp = editingField === "timestamp";
    const isEditingISO = editingISO;

    let displayTimestamp;
    if (isEditingTimestamp) {
      displayTimestamp = inputs.timestamp;
    } else {
      displayTimestamp = hasSubfieldErrors ? "N/A" : this.formatDate().toString();
    }

    let displayISO;
    if (!dateTime.isValid) {
      displayISO = "N/A";
    } else if (isEditingISO) {
      displayISO = inputs.iso;
    } else {
      displayISO = dateTime.toISO();
    }

    const showTimestampError = !hasSubfieldErrors && errors.timestamp;
    const showISOError = errors.iso; 

    // Determine maxLength based on format
    const maxDigits = this.getMaxDigits(format);
    const maxLengthTimestamp = format !== "iso" ? maxDigits + 1 : undefined; // +1 to allow for optional leading hyphen
    const maxLengthISO = 35; 

    return (
      <main className="overflow-y-auto p-4 md:p-6 lg:p-8 xl:p-10 md:pt-4 lg:pt-5 xl:pt-5 h-full">
        <section className="flex flex-col gap-4">
          <h1 className="text-3xl text-white font-semibold lg:pb-1"> Timestamp Converter</h1>

          {this.renderDropdown("Time Zone", timeZone, this.handleTimeZoneChange, timeZones)}

          <div className="flex h-14 items-center gap-6 rounded-lg bg-gray-800 px-4 mb-2">
            <span className="text-white flex-1">Format</span>
            <select value={format} onChange={this.handleFormatChange} className="h-10 w-32 bg-gray-700 text-white px-2 rounded-lg">
              <option value="ticks">Ticks</option>
              <option value="milliseconds">Milliseconds</option>
              <option value="seconds">Seconds</option>
            </select>
          </div>

          <section className="flex flex-col gap-[0.8rem] xl:gap-36 bg-gray-800 p-4 pb-3 pt-3 rounded-lg xl:flex-row xl:justify-between">
            <div className="flex flex-col gap-2 xl:w-1/2">
              <div className="flex justify-between">
                <span className="text-white text-lg font-sans">Offset:</span> 
                <span className="text-white font-mono mt-1">{displayOffset}</span> 
              </div>
              <div className="flex justify-between">
                <span className="text-white text-lg font-sans">Local Date & Time:</span>
                <span className="text-white font-mono mt-1">{displayLocalDateTime}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 xl:w-1/2">
              <div className="flex justify-between">
                <span className="text-white text-lg font-sans">UTC Ticks:</span> 
                <span className="text-white font-mono mt-1">{displayUtcTicks}</span> 
              </div>
              <div className="flex justify-between">
                <span className="text-white text-lg font-sans">UTC Date & Time:</span> 
                <span className="text-white font-mono mt-1">{displayUtcDateTime}</span>
              </div>
            </div>
          </section>

          {this.renderInputField(
            "Timestamp",
            displayTimestamp, 
            this.handleTimestampChange,
            !showTimestampError,
            true,
            showTimestampError,
            showTimestampError ? timestampErrorMessage || "Invalid timestamp value." : null,
            maxLengthTimestamp, 
            format !== "iso" ? "numeric" : "text", 
            () => {
              this.setState({ editingField: "timestamp", editingISO: false });
              this.resetISOError(); // Reset ISO error when focusing on Timestamp
            }, 
            () => this.setState({ editingField: null }) 
          )}

          {/* ISO 8601 Input */}
          {this.renderInputField(
            "ISO 8601",
            displayISO,
            this.handleISOChange, 
            !showISOError,
            true,
            showISOError,
            showISOError ? isoErrorMessage || "ISO 8601 field is not editable." : null,
            maxLengthISO, 
            "text", 
            () => {
              this.setState({ editingISO: true, editingField: null });
              this.resetISOError(); 
            }, 
            () => this.handleISOBlur(), 
            false, 
            this.handleISOKeyDown 
          )}

          {/* Date Fields */}
          <div className="grid grid-cols-3 gap-4">
            {this.renderInputField(
              "Year",
              inputs.year,
              (e) => this.handleFieldChange("year", e.target.value),
              !errors.year,
              false,
              errors.year,
              errors.year ? "Year must be a positive integer." : null,
              null,
              "numeric",
              () => {
                this.resetISOError();
              },
              null
            )}
            {this.renderInputField(
              "Month",
              inputs.month,
              (e) => this.handleFieldChange("month", e.target.value),
              !errors.month,
              false,
              errors.month,
              errors.month ? "Month must be between 1 and 12." : null,
              null,
              "numeric",
              () => {
                this.resetISOError();
              },
              null
            )}
            {this.renderInputField(
              "Day",
              inputs.day,
              (e) => this.handleFieldChange("day", e.target.value),
              !errors.day,
              false,
              errors.day,
              errors.day ? "Day must be between 1 and 31." : null,
              null,
              "numeric",
              () => {
                this.resetISOError();
              },
              null
            )}
          </div>

          {/* Time Fields */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {this.renderInputField(
              "Hours",
              inputs.hours,
              (e) => this.handleFieldChange("hours", e.target.value),
              !errors.hours,
              false,
              errors.hours,
              errors.hours ? "Hours must be between 0 and 23." : null,
              null,
              "numeric",
              () => {
                this.resetISOError();
              },
              null
            )}
            {this.renderInputField(
              "Minutes",
              inputs.minutes,
              (e) => this.handleFieldChange("minutes", e.target.value),
              !errors.minutes,
              false,
              errors.minutes,
              errors.minutes ? "Minutes must be between 0 and 59." : null,
              null,
              "numeric",
              () => {
                this.resetISOError();
              },
              null
            )}
            {this.renderInputField(
              "Seconds",
              inputs.seconds,
              (e) => this.handleFieldChange("seconds", e.target.value),
              !errors.seconds,
              false,
              errors.seconds,
              errors.seconds ? "Seconds must be between 0 and 59." : null,
              null,
              "numeric",
              () => {
                this.resetISOError();
              },
              null
            )}
            {this.renderInputField(
              "Milliseconds",
              inputs.milliseconds,
              (e) => this.handleFieldChange("milliseconds", e.target.value),
              !errors.milliseconds,
              false,
              errors.milliseconds,
              errors.milliseconds ? "Milliseconds must be between 0 and 999." : null,
              null,
              "numeric",
              () => {
                this.resetISOError();
              },
              null
            )}
          </div>
        </section>
      </main>
    );
  }
}

export default DateConverter;
