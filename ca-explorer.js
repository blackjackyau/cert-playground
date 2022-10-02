import { CertHandler } from "util";

export default function CaExplorer() {
  const Link = ReactRouterDOM.Link;

  const [caCerts, setCaCerts] = React.useState({});
  const certHandler = new CertHandler();

  async function loadCaCerts() {
    const caBundlesResp = await fetch("ca-bundle.crt");
    const caBundlesText = await caBundlesResp.text();

    setCaCerts(() => {
      const caCerts = certHandler.parse(caBundlesText);
      return caCerts;
    });
  }

  React.useEffect(() => {
    const setup = async () => {
      await loadCaCerts();
    };
    setup();
  }, []);

  return (
    <div className="container">
      <span className="badge bg-info">Number of CA Cert Loaded: {Object.keys(caCerts).length}</span>
      <span className="badge bg-light"><Link  to="/">To Cert Playground</Link></span>
      <div className="mb-3">
        {Object.entries(caCerts).map(([subject, { cert, pem }], index) => {

          const notBeforeUTC = zulutodate(cert.getNotBefore()).toUTCString();
          const notBefore = zulutodate(cert.getNotBefore()).toString();
          const notAfterUTC = zulutodate(cert.getNotAfter()).toUTCString();
          const notAfter = zulutodate(cert.getNotAfter()).toString();

          return (<div className="card">
            <div className="card-header" id={`heading${index}`}>
              <h5 className="mb-0">
                <button className="btn btn-link" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`} aria-expanded="true" aria-controls={`collapse${index}`}>
                  {subject}
                </button>
              </h5>
            </div>
            <div id={`collapse${index}`} className="collapse" aria-labelledby={`#heading${index}`} data-parent="#accordion">
              <div className="card-body">
                <pre className="card-text text-break">{cert.getInfo()}</pre>
              </div>
              <ul className="list-group">
                <li className="list-group-item text-break">
                  <div>Additional Info</div>
                  <pre>
                    Not Before (UTC): {notBeforeUTC}
                    <br />
                    Not Before: {notBefore}
                    <br />
                    Not After (UTC): {notAfterUTC}
                    <br />
                    Not After: {notAfter}
                  </pre>
                </li>
                <li className="list-group-item text-break">
                  <a className="btn btn-secondary btn-sm" data-bs-toggle="collapse" href={`#colPK${index}`} role="button" aria-expanded="false" aria-controls={`colPK${index}`}>
                    Public Key
                  </a>
                  <div className="collapse mt-1" id={`colPK${index}`}>
                    {cert.getPublicKeyHex()}
                  </div>
                </li>
                <li className="list-group-item text-break">
                  <a className="btn btn-secondary btn-sm" data-bs-toggle="collapse" href={`#colSignature${index}`} role="button" aria-expanded="false" aria-controls={`colSignature${index}`}>
                    Signature
                  </a>
                  <div className="collapse mt-1" id={`colSignature${index}`}>
                    {cert.getSignatureValueHex()}
                  </div>
                </li>
                <li className="list-group-item text-break">
                  <a className="btn btn-secondary btn-sm" data-bs-toggle="collapse" href={`#colPem${index}`} role="button" aria-expanded="false" aria-controls={`colPem${index}`}>
                    Pem
                  </a>
                  <pre className="collapse mt-1" id={`colPem${index}`}>
                    {pem}
                  </pre>
                </li>
              </ul>
            </div>
          </div>)
        })
        }
      </div>
    </div>
  )
}
