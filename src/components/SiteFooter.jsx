import { profile } from '../data/profile.js';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <span>{profile.name} &middot; {profile.discipline}</span>
        <a className="contact__link" href="#top">Back to top</a>
      </div>
    </footer>
  );
}
