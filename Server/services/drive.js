const { google, authorize } = require('./google/sheet.config');
const path  = require('path');
const fs = require('fs');
const stream = require('stream');
const CREDENTIALS_PATH = path.join(__dirname, './credentials.json');

class GoogleDrive {

  constructor() {
  }

  initialize(){
    return new Promise((resolve, reject)=>{
        fs.readFile(CREDENTIALS_PATH, (err, content) => {
            if (err) reject({error: `Error loading client secret file:${err}` });
            //  console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Google Sheets API.
            authorize(JSON.parse(content), (auth) => {
               this.auth = auth;
               resolve({sucess: true});
            });
        });
    })
  }

  async listFiles() {
    return new Promise((resolve, reject) => {
      const drive = google.drive({version: 'v3', auth: this.auth});
          drive.files.list({
            pageSize: 10,
            fields: 'nextPageToken, files(id, name)',
          }, (err, res) => {
            if (err) {
              reject('The API returned an error: ' + err);
            }
            const files = res.data.files;
            // console.log('....', res.data);
            if (files.length) {
              console.log('Files exits');
              // files.map((file) => {
              //   console.log(`${file.name} (${file.id})`);
              // });
            } else {
              console.log('No files found');
            }
            resolve(files);
          });
    });
  }

  async copyFile(fileName, folderId, copyFileId) {
    return new Promise((resolve, reject) => {
      let body = {
        "title": fileName,
        "parents": [
          {
            "id": folderId
          }
        ]
      };
      const drive = google.drive({version: 'v2', auth: this.auth});
          drive.files.copy({
            'fileId': copyFileId,
            'resource': body
          }, (err, res) => {
            if (err) {
              reject('The API returned and error: ' + err);
            } else {
              console.log('...', res.data);
              resolve(res.data);
            }
          });
    });
  }

  async createFile(fileName, folderId, mimeType, file = null){
    return new Promise((resolve, reject)=>{
        let fileMetadata = {
            'name': fileName,
            'mimeType': mimeType,
            parents: [folderId]
        };

        // Upload File body if there is any
        let media;
        if (file != null) {
          // decoding multipart data
          let bufferStream = new stream.PassThrough();
          bufferStream.end(file.buffer);

          media = {
            mimeType: file.mimetype,
            body: bufferStream
          }
        }

        const drive = google.drive({version: 'v3',  auth: this.auth});
        drive.files.create({
            resource: fileMetadata,
            media: media
        }, function (err, file) {
            if (err) {
            // Handle error
                console.error(err);
                reject('The API returned an error: ' + err);
            } else {
                console.log('Folder Id: ', file.data);
                resolve(file.data)
            }
        });
    })
}

  async filePermission(fileId, metaData) {
    return new Promise((resolve, reject) => {
      let fileMetaData = {
        'role': metaData.role,
        'type': metaData.type
      };

      const drive = google.drive({version: 'v2', auth: this.auth});
          drive.permissions.create({
            fileId: fileId,
            resource: fileMetaData
          }, (err, file) => {
            if (err) {
              console.log(err);
              reject('The API returned and error: ' + err);
            } else {
              console.log('Permission Id: ', file.data);
              resolve(file);
            }
          });
    })
  }

}

module.exports = GoogleDrive;