import CertTables from "cert-tables";
import { CertHandler } from "util";

export default function MainContent() {
  const Link = ReactRouterDOM.Link;

  const [caCerts, setCaCerts] = React.useState({});
  const [formData, setFormData] = React.useState({
    certs: "",
    autoEval: false
  });

  const [certs, setCerts] = React.useState();
  const certHandler = new CertHandler();

  async function loadCaCerts() {
    const caBundlesResp = await fetch("ca-bundle.crt");
    const caBundlesText = await caBundlesResp.text();

    setCaCerts(() => {
      const caCerts = certHandler.parse(caBundlesText);
      return caCerts;
    });
  }

  async function loadGithubCert() {
    const githubCertResp = await fetch("github-chain.crt");
    const githubCert = await githubCertResp.text();

    setFormData((prev => {
      return {
        ...prev,
        certs: githubCert,
        autoEval: true
      }
    }));
  }

  function handleChange(event) {
    setFormData(prev => {
      return {
        ...prev,
        [event.target.name]: event.target.value,
        autoEval: false
      }
    })
  }

  function evaluate() {
    setCerts(_ => {
      let certs;
      try {
        certs = certHandler.parse(formData.certs);
      } catch (ex) {
        alert('Error parsing certs', ex);
        return;
      }

      return Object.values(certs).map(certObject => {
        const cert = certObject.cert;

        const result = {
          cert: certObject,
          meta: {
            selfSigned: false, signatureVerified: false,
            caCert: false, issuer: undefined, issuerFromPublicCa: false,
            sha1hex: undefined, sha256hex: undefined, notExpired: true
          }
        };

        const issuer = cert.getIssuer().str;
        const subject = cert.getSubject().str;

        if (issuer === subject) {
          result.meta.selfSigned = true;
        }

        try {
          const constraints = cert.getExtBasicConstraints();
          result.meta.caCert = constraints ? cert.getExtBasicConstraints()["cA"] : false;
        } catch (ex) {
          console.log("constraints not found", cert);
        }

        let issuerCert = certs[cert.getIssuer().str];
        if (!issuerCert) {
          const caCert = caCerts[cert.getIssuer().str];
          if (caCert) {
            result.meta.issuerFromPublicCa = true;
            issuerCert = caCert;
          }
        }
        result.meta.issuer = issuerCert;

        if (issuerCert) {
          const pubKey = issuerCert.cert.getPublicKey();
          result.meta.signatureVerified = cert.verifySignature(pubKey);
        }

        result.meta.sha1hex = KJUR.crypto.Util.hashHex(cert.hex, 'sha1');
        result.meta.sha256hex = KJUR.crypto.Util.hashHex(cert.hex, 'sha256');

        const now = new Date().getTime();
        result.meta.notExpired = now > zulutodate(cert.getNotBefore()).getTime() && now < zulutodate(cert.getNotAfter()).getTime();

        return result;
      })
    });
  }

  // https://github.com/kjur/jsrsasign/wiki/Tutorial-for-accessing-deep-inside-of-ASN.1-structure-by-using-new-ASN1HEX.getIdxbyListEx >> ASN hex access
  // https://github.com/kjur/jsrsasign/blob/0c47b952931fb52658567e4821593a05266f6e0f/src/x509-1.1.js#L505-L514 >> how to verify cert signature ( where to generate hex/payload )
  // https://github.com/kjur/jsrsasign/blob/f3d70198b2d923bdeacd2bd8c60605a96101d802/src/rsasign-1.2.js#L274-L291 >> how signature works
  // https://stackoverflow.com/questions/42691048/whats-the-detail-in-sha1withrsa >> e.g. 

  React.useEffect(() => {
    formData.autoEval && evaluate();
  }, [formData]);

  React.useEffect(() => {
    const setup = async () => {
      await loadCaCerts();
      await loadGithubCert();
    };
    setup();
  }, []);

  return (
    <div className="container">
      <span className="badge bg-info">Number of CA Cert Loaded: {Object.keys(caCerts).length}</span>
      <span className="badge bg-light"><Link to="/ca-explorer">To CA Explorer</Link></span>
      <div className="mb-3">
        <label for="certs-ta" className="form-label"><h5>Enter Certificate Chains with -----BEGIN/END CERTIFICATE-----</h5></label>
        <textarea className="form-control" id="certs-ta" name="certs" rows="10"
          value={formData.certs} onChange={handleChange}
        ></textarea>
        <button className="btn btn-primary m-2" onClick={evaluate}>Evaluate</button>
        {certs && (<CertTables certs={certs}></CertTables>)}
      </div>
    </div>
  )
}

