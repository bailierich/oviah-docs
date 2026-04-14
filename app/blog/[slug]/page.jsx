export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  return (
    <div className="page-body">
      <div className="section-label">Blog</div>
      <p className="body-text">Post: {slug}</p>
    </div>
  );
}
