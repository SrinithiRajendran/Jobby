import { useEffect } from "react";
import PropTypes from "prop-types";
import { ThreeDots } from "react-loader-spinner";

import "./index.css";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const ProfileDetails = ({
  profileDetails,
  profileApiStatus,
  getProfileDetails,
}) => {
  useEffect(() => {
    getProfileDetails();
  }, [getProfileDetails]);

  const renderProfileLoaderView = () => (
    <div className="profile-loader-container" data-testid="loader">
      <ThreeDots color="#ffffff" height={50} width={50} />
    </div>
  );

  const renderProfileFailureView = () => (
    <div className="profile-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="profile-failure-image"
      />
      <h1 className="failure-view-heading">Oops! Something Went Wrong</h1>
      <p className="failure-view-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={getProfileDetails}
      >
        Retry
      </button>
    </div>
  );

  const renderProfileSuccessView = () => {
    const { name, profileImageUrl, shortBio } = profileDetails;

    return (
      <div className="profile-details-container">
        <img src={profileImageUrl} alt="profile" className="profile-image" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
    );
  };

  const renderProfileDetails = () => {
    switch (profileApiStatus) {
      case apiStatusConstants.inProgress:
        return renderProfileLoaderView();
      case apiStatusConstants.success:
        return renderProfileSuccessView();
      case apiStatusConstants.failure:
        return renderProfileFailureView();
      default:
        return null;
    }
  };

  return <div className="profile-details">{renderProfileDetails()}</div>;
};

ProfileDetails.propTypes = {
  profileDetails: PropTypes.shape({
    name: PropTypes.string,
    profileImageUrl: PropTypes.string,
    shortBio: PropTypes.string,
  }).isRequired,
  profileApiStatus: PropTypes.string.isRequired,
  getProfileDetails: PropTypes.func.isRequired,
};

export default ProfileDetails;
