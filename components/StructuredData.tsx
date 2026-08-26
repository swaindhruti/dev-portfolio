const SITE_URL = "https://dhrutinandan.space";

export default function StructuredData() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Dhrutinandan Swain",
    url: SITE_URL,
    jobTitle: "Backend Engineer, AI Engineer, Full-Stack Engineer",
    email: "mailto:dhrutinandan.dev@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressRegion: "Odisha",
      addressCountry: "IN",
    },
    sameAs: [
      "https://github.com/swaindhruti",
      "https://twitter.com/D_SwainX",
      "https://linkedin.com/in/dhrutinandan",
      "https://dhrutiswain.substack.com",
      "https://medium.com/@dhrutinandan",
      "https://linktr.ee/dhrutinandan",
    ],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: SITE_URL,
    name: "Dhrutinandan Swain",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
    </>
  );
}
