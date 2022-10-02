
export default function CertTables(props) {
  return (
    <table class="table table-sm">
      <thead>
        <tr>
          <th scope="col">Cert</th>
          <th scope="col">Evaluation</th>
        </tr>
      </thead>
      <tbody>
        {props.certs.map((certResult, index) => {

          const cert = certResult.cert.cert;
          const pem = certResult.cert.pem;
          const notBeforeUTC = zulutodate(cert.getNotBefore()).toUTCString();
          const notBefore = zulutodate(cert.getNotBefore()).toString();
          const notAfterUTC = zulutodate(cert.getNotAfter()).toUTCString();
          const notAfter = zulutodate(cert.getNotAfter()).toString();

          return (<tr>
            <td className="w-50">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{cert.getSubject().str}</h5>
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
            </td>
            <td className="w-50">
              <li className="list-group-item">
                {certResult.meta.selfSigned ? (<span class="badge bg-primary m-1">Self Signed</span>) : undefined}
                {certResult.meta.caCert ? (<span class="badge bg-primary m-1">CA Cert</span>) : undefined}
                {certResult.meta.signatureVerified ? (<span class="badge bg-success m-1">Signature Verified</span>) : (<span class="badge bg-danger">Signature Not Verified</span>)}
                {certResult.meta.notExpired ? (<span class="badge bg-success m-1">Not Expired</span>) : (<span class="badge bg-danger">Expired</span>)}
              </li>
              <li className="list-group-item text-break">
                {certResult.meta.issuer ? (
                  <div>
                    <a className="btn btn-primary btn-sm" data-bs-toggle="collapse" href={`#colIssuer${index}`} role="button" aria-expanded="false" aria-controls={`colIssuer${index}`}>
                      Issuer Cert
                    </a><span class="m-2 badge bg-light text-dark">{certResult.meta.issuer.cert.getSubject().str}</span>
                    {certResult.meta.issuerFromPublicCa ? (<span class="badge bg-primary m-1">Public CA</span>) : undefined}
                    <div className="collapse mt-1" id={`colIssuer${index}`}>
                      <pre>{certResult.meta.issuer.cert.getInfo()}</pre>
                      <ul className="list-group">
                        <li className="list-group-item text-break">
                          <a className="btn btn-secondary btn-sm" data-bs-toggle="collapse" href={`#colPem${index}`} role="button" aria-expanded="false" aria-controls={`colPem${index}`}>
                            Pem
                          </a>
                          <pre className="collapse mt-1" id={`colPem${index}`}>
                            {certResult.meta.issuer.pem}
                          </pre>
                        </li>
                      </ul>
                    </div>
                  </div>) : (<div>No Issuer Found</div>)
                }
              </li>
              <li className="list-group-item text-break">
                <div>
                  <a className="btn btn-primary btn-sm" data-bs-toggle="collapse" href={`#colThumbprint${index}`} role="button" aria-expanded="false" aria-controls={`colThumbprint${index}`}>
                    Thumbprint
                  </a>
                  <pre className="collapse mt-1" id={`colThumbprint${index}`}>
                    sha1hex: {certResult.meta.sha1hex}
                    <br />
                    sha256hex: {certResult.meta.sha256hex}
                  </pre>
                </div>
              </li>
            </td>
          </tr>
          )
        }
        )}
      </tbody>
    </table>
  );
}