const usercreationmail = require("./usercraetionmail")
const newquizaltertr = require("./newquizaltertr")
const user = {
    username: 'test',
    email: '"adhithiyan.21it@sonatech.ac.in"',
    
  }
  const quiz = {
    title: 'test',
    endtime: "2024-12-28T00:39:00.000+00:00",
    
  }
newquizaltertr(quiz,user)