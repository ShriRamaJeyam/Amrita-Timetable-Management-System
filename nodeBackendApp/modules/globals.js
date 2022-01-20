var Globals = {};
var Greeting = "Om Namo Naarayanaya";
Globals.isDatabaseSynced = false;
Globals.RegEx={
    PhoneNumber:/[1-9][0-9]{9}/g,
    EmployeeID:/[1-9][0-9]*/g,
    Password:/[\s\S]{8,15}/g
};

module.exports={Globals,Greeting};