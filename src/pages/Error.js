import Banner from '../components/Banner';

export default function Error() {
  const errorData = {
    title: "404 - Page Not Found",
    content: "Oops! The page you're looking for doesn’t exist. Let’s get you back on track.",
    destination: "/",
    buttonLabel: "Back to Home"
  };

  return <Banner data={errorData} />;
}
