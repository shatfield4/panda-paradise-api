const express = require('express')
const multer = require('multer')
const path = require('path')
const moment = require('moment')
const { HOST } = require('./src/constants')
const db = require('./src/database')
const fs = require('fs')

const PORT = process.env.PORT || 80

const app = express()
  .set('port', PORT)
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')

// Static public files
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function(req, res) {
  res.send('alive');
})
app.use('/images', express.static('./storage/images'));

app.get('/api/token/:token_id', function(req, res) {
  const tokenId = parseInt(req.params.token_id).toString()
  // const person = db[tokenId]
  // const bdayParts = person.birthday.split(' ')
  // const day = parseInt(bdayParts[1])
  // const month = parseInt(bdayParts[0])
  // const data = {
  //   'name': person.name,
  //   'attributes': {
  //     'birthday': person.birthday,
  //     'birth month': monthName(month),
  //     'zodiac sign': zodiac(day, month),
  //     // 'age': moment().diff(person.birthday, 'years')
  //   },
  //   'image': `${HOST}/images/${tokenId}.png`
  // }

  if (parseInt(tokenId) < 0 || parseInt(tokenId) > 8887) {
    console.log('Token ID does not exist');
    errorData = {
      'Error' : 'Token ID does not exist'
    }
    res.send(errorData)
    return;
  }


  fs.readFile('./storage/metadata/' + tokenId + '.json', (err, fileObj) => {
    if (err) throw err;
    let file = JSON.parse(fileObj);
    // console.log(file['attributes']);

    const data = {
      "name": `Panda Paradise #${tokenId}`,
      "description": "Panda Paradise is a collection of 8,888 unique Panda NFTs - living on the Ethereum blockchain. Your Panda Paradise NFT is also your exclusive ticket into our diverse and growing community, and grants access to holder on benefits, which include future airdrop, utility token mechanisms, and our upcoming sandbox MMORPG. All this will be unlocked by our team of developers and community through our roadmap milestones. Join our Paradise here, https://pandaparadise.io/.",
      "image": `${HOST}/${tokenId}.png`,
      "attributes": file['attributes'],
    }
    res.send(data)


    // file['attributes'];
  });


 
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
})

// returns the zodiac sign according to day and month ( https://coursesweb.net/javascript/zodiac-signs_cs )
function zodiac(day, month) {
  var zodiac =['', 'Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn'];
  var last_day =['', 19, 18, 20, 20, 21, 21, 22, 22, 21, 22, 21, 20, 19];
  return (day > last_day[month]) ? zodiac[month*1 + 1] : zodiac[month];
}

function monthName(month) {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ]
  return monthNames[month - 1]
}

function getAttributes(tokenId) {
  let returnData = [];
  fs.readFile('./storage/metadata/' + tokenId + '.json', (err, data) => {
    if (err) throw err;
    let file = JSON.parse(data);
    console.log(file['attributes']);
    returnData = file['attributes'];
  });

  return returnData;
}