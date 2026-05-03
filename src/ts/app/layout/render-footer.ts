import { FooterContactItemData, renderFooterContactItem } from "./render-footer-contact-item";
import { FooterColumnData, renderFooterColumn } from "./render-footer-column";

const footerColumns: FooterColumnData[] = [
  {
    title: "About Us",
    titleHref: "/html/about.html",
    links: [
      {
        label: "Organisation",
        href: "/html/about.html",
      },
      {
        label: "Partners",
        href: "/html/about.html",
      },
      {
        label: "Clients",
        href: "/html/about.html",
      },
    ],
  },
  {
    title: "Interesting Links",
    links: [
      {
        label: "Photo Gallery",
        href: "/html/catalog.html",
      },
      {
        label: "Our Team",
        href: "/html/about.html",
      },
      {
        label: "Socials",
        href: "/html/contact.html",
      },
    ],
  },
  {
    title: "Achievements",
    links: [
      {
        label: "Winning Awards",
        href: "/html/about.html",
      },
      {
        label: "Press",
        href: "/html/contact.html",
      },
      {
        label: "Our Amazing Clients",
        href: "/html/about.html",
      },
    ],
  },
];

const footerContactItems: FooterContactItemData[] = [
  {
    iconName: "phone",
    type: "Phone",
    value: "Phone: (+63) 236 6322",
  },
  {
    iconName: "mail",
    type: "Email",
    value: "public@news.com",
  },
  {
    iconName: "clock",
    type: "Hours",
    value: "Mon - Fri: 10am - 6pm\nSat - Sun: 10am - 6pm",
  },
  {
    iconName: "location-pin",
    type: "Location",
    value: "639 Jade Valley,\nWashington Dc",
  },
];

export function renderFooter(): void {
  const root = document.querySelector<HTMLElement>('[data-layout="footer"]');

  if (!root) {
    return;
  }

  root.innerHTML = `
    <footer class="site-footer">
      <div class="site-footer__inner">
        <div class="footer-main">
          <div class="footer-columns"></div>

          <section class="footer-contact">
            <h3 class="footer-contact__title">
              <a class="footer-heading-link" href="/html/contact.html">Contact Us</a>
            </h3>
            <p class="footer-contact__text">Bendum dolor eu varius. Morbi fermentum velitsodales egetonec. volutpat orci. Sed ipsum felis, tristique egestas et, convallis ac velitn consequat nec luctus.</p>
            <div class="footer-contact-list"></div>
          </section>

          <section class="footer-shipping">
            <h3 class="footer-shipping__title">Shipping Information</h3>
            <p class="footer-shipping__details">Nulla eleifend pulvinar purus, molestie euismod odio imperdiet ac. Ut sit amet erat nec nibh rhoncus varius in non lorem. Donec interdum, lectus in convallis pulvinar, enim elit porta sapien, vel finibus erat felis sed neque. Etiam aliquet neque sagittis erat tincidunt aliquam.</p>
          </section>
        </div>

        <div class="footer-copyright">© Copyright 2025</div>
      </div>
    </footer>
  `;

  const columnsRoot = root.querySelector<HTMLElement>(".footer-columns");
  columnsRoot?.append(...footerColumns.map(renderFooterColumn));

  const contactRoot = root.querySelector<HTMLElement>(".footer-contact-list");
  contactRoot?.append(...footerContactItems.map(renderFooterContactItem));
}
