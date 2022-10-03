

export default function CertAdditionalInfo(props) {

  const cert = props.cert;
  const id = props.id;
  const pem = props.pem;
  const x500Issuer = KJUR.asn1.x509.X500Name.compatToLDAP(cert.getIssuerString());
  const x500Subject = KJUR.asn1.x509.X500Name.compatToLDAP(cert.getSubjectString());
  const notBeforeUTC = zulutodate(cert.getNotBefore()).toUTCString();
  const notBefore = zulutodate(cert.getNotBefore()).toString();
  const notAfterUTC = zulutodate(cert.getNotAfter()).toUTCString();
  const notAfter = zulutodate(cert.getNotAfter()).toString();
  const sha1hex = KJUR.crypto.Util.hashHex(cert.hex, 'sha1');
  const sha256hex = KJUR.crypto.Util.hashHex(cert.hex, 'sha256');

  return (
    <ul className="list-group">
      <li className="list-group-item text-break">
        <div>Additional Info</div>
        <pre>
          Issuer (X500/LDAP): {x500Issuer}
          <br />
          Subject (X500/LDAP): {x500Subject}
          <br />
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
        <a className="btn btn-secondary btn-sm" data-bs-toggle="collapse" href={`#colPK${id}`} role="button" aria-expanded="false" aria-controls={`colPK${id}`}>
          Public Key
        </a>
        <div className="collapse mt-1 prelike-font" id={`colPK${id}`}>
          {cert.getPublicKeyHex()}
        </div>
      </li>
      <li className="list-group-item text-break">
        <a className="btn btn-secondary btn-sm" data-bs-toggle="collapse" href={`#colSignature${id}`} role="button" aria-expanded="false" aria-controls={`colSignature${id}`}>
          Signature
        </a>
        <div className="collapse mt-1 prelike-font" id={`colSignature${id}`}>
          {cert.getSignatureValueHex()}
        </div>
      </li>
      <li className="list-group-item text-break">
        <a className="btn btn-secondary btn-sm" data-bs-toggle="collapse" href={`#colThumbprint${id}`} role="button" aria-expanded="false" aria-controls={`colThumbprint${id}`}>
          Thumbprint
        </a>
        <pre className="collapse mt-1" id={`colThumbprint${id}`}>
          sha1hex: {sha1hex}
          <br/>
          sha256hex: {sha256hex}
        </pre>
      </li>
      <li className="list-group-item text-break">
        <a className="btn btn-secondary btn-sm" data-bs-toggle="collapse" href={`#colPem${id}`} role="button" aria-expanded="false" aria-controls={`colPem${id}`}>
          Pem
        </a>
        <pre className="collapse mt-1" id={`colPem${id}`}>
          {pem}
        </pre>
      </li>
    </ul>
  );
}
