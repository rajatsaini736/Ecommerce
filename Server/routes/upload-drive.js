const express = require('express');
const router = express.Router();
const helper = require('../config/helpers')
const multer = require('multer');
let upload = multer({ storage: multer.memoryStorage()});

const GoogleDriveServices = require('../services/drive');

const MIMETYPE = {
  DRIVE: "application/vnd.google-apps.folder",
  DOCUMENT: "application/vnd.google-apps.document"
}

router.post('/', upload.single('file'), async (req, res)=>{

  try {
    if (!req.file) throw new Error('No file found');

    const {file} = req;
    const driveService = new GoogleDriveServices();
  
    // Initializing drive service & creating a folder
    await driveService.initialize();
    let createFolder = await driveService.createFile("Uploaded-docs", process.env.DRIVE_ID, MIMETYPE.DRIVE);
  
    // uploading file
    let createFile = await driveService.createFile("Untittled-1", createFolder.id, MIMETYPE.DOCUMENT, file);
    
    res.json({result: null});
  } catch(err) {
    console.log(err);
    res.send({result: err});
  }
});

router.post('/copy-link', async (req, res) => {
  const {copy_id} = req.body;

  const driveService = new GoogleDriveServices();

  // Initializing drive service & creating a folder
  await driveService.initialize();
  let createFolder = await driveService.createFile("Copied-docs", process.env.DRIVE_ID, MIMETYPE.DRIVE);

  // Copying file 
  let copyFile = await driveService.copyFile('copy-1', createFolder.id, copy_id);

  res.json({result: null});

})

module.exports = router;