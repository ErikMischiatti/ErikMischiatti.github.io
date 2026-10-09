// Directory data for project pages. A project is written to its existing public URL only when
// it is published, or in a preview build. Unpublished projects still feed the homepage and the
// index, which link to the legacy page when one is kept (`legacy: true`) or show no link.
export default {
  navCurrent: "Work",
  eleventyComputed: {
    // A file without sections (a homepage/index stub) never becomes a page. A project listed in
    // approvals.json reaches production only once approved there.
    permalink: (d) => {
      const approved = !d.approvals?.[d.slug] || d.approvals[d.slug].approved === true;
      return ((d.publish && approved) || d.build.preview) && d.sections?.length ? d.urlPath : false;
    },
  },
};
