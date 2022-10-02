export class CertHandler {

  newLine = "\n";

  parse(certBundlesText) {
    const certs = {};
    const splits = certBundlesText.split(this.newLine);

    let certTemp = [];
    for (let i = 0; i < splits.length; i++) {
      let line = splits[i];
      if (line.length === 0) {
        continue;
      }

      certTemp.push(line);
      if (line.match(/-END CERTIFICATE-/)) {
        const cert = new X509();
        const pem = certTemp.join(this.newLine);
        cert.readCertPEM(pem);
        cert.getInfo(); // validate
        certs[`${cert.getSubjectString()}`] = { cert, pem };
        certTemp = [];
      }
    }
    return certs;
  }
}