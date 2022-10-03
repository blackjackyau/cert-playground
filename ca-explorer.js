import { CertHandler } from "util";
import CertAdditionalInfo from "cert-additional-info";

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
              <CertAdditionalInfo cert={cert} pem={pem} id={index}></CertAdditionalInfo>
            </div>
          </div>)
        })
        }
      </div>
    </div>
  )
}
