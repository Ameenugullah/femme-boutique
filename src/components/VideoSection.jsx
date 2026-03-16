export default function VideoSection() {
  return (
    <section className="w-full bg-black">
      <video
        className="w-full block"
        style={{ maxHeight: '100vh' }}
        controls
        playsInline
        preload="auto"
      >
        {/* Place your video file at: public/videos/nurabahar.mp4 */}
        <source src="/videos/nurabahar.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </section>
  );
}
