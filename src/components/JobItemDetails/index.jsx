import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { AiFillStar } from "react-icons/ai";
import { IoLocationSharp } from "react-icons/io5";
import { BsFillBriefcaseFill } from "react-icons/bs";
import { FiExternalLink } from "react-icons/fi";
import { ThreeDots } from "react-loader-spinner";

import Header from "../Header";
import SimilarJobCard from "../SimilarJobCard";

import "./index.css";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const JobItemDetails = () => {
  const [jobDetailsApiStatus, setJobDetailsApiStatus] = useState(
    apiStatusConstants.initial
  );
  const [jobDetails, setJobDetails] = useState({});
  const [similarJobs, setSimilarJobs] = useState([]);

  const getJobItemDetails = useCallback(async () => {
    setJobDetailsApiStatus(apiStatusConstants.inProgress);

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts/1"
      );
      const data = await response.json();

      const jobDetails = {
        companyLogoUrl: "https://via.placeholder.com/150",
        companyWebsiteUrl: "https://example.com",
        employmentType: "Full Time",
        jobDescription: data.body,
        location: "Location",
        rating: 4.5,
        title: data.title,
        packagePerAnnum: "10 LPA",
        skills: [
          { imageUrl: "https://via.placeholder.com/50", name: "Skill 1" },
          { imageUrl: "https://via.placeholder.com/50", name: "Skill 2" },
        ],
        lifeAtCompany: {
          description: "Life at company description",
          imageUrl: "https://via.placeholder.com/150",
        },
      };

      const similarJobsResponse = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      const similarJobsData = await similarJobsResponse.json();

      const similarJobs = similarJobsData.slice(0, 5).map((job) => ({
        companyLogoUrl: "https://via.placeholder.com/150",
        employmentType: "Part Time",
        id: job.id,
        jobDescription: job.body,
        location: "Location",
        rating: 4.0,
        title: job.title,
      }));

      setJobDetails(jobDetails);
      setSimilarJobs(similarJobs);
      setJobDetailsApiStatus(apiStatusConstants.success);
    } catch {
      setJobDetailsApiStatus(apiStatusConstants.failure);
    }
  }, []);

  useEffect(() => {
    getJobItemDetails();
  }, [getJobItemDetails]);

  const renderLoaderView = () => (
    <div className="jobs-loader-container" data-testid="loader">
      <ThreeDots color="#ffffff" height={50} width={50} />
    </div>
  );

  const renderApiFailureView = () => (
    <div className="jobs-api-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="job-api-failure-image"
      />
      <h1 className="failure-view-heading">Oops! Something Went Wrong</h1>
      <p className="failure-view-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={getJobItemDetails}
      >
        Retry
      </button>
    </div>
  );

  const renderJobDetails = () => {
    const {
      companyLogoUrl,
      employmentType,
      jobDescription,
      location,
      rating,
      title,
      packagePerAnnum,
      companyWebsiteUrl,
      skills,
      lifeAtCompany,
    } = jobDetails;

    return (
      <div className="job-details-content-container">
        <div className="job-details">
          <div className="logo-title-container-card">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo-card"
            />
            <div className="title-rating-container-card">
              <h1 className="job-title-card">{title}</h1>
              <div className="rating-container-card">
                <AiFillStar className="star-icon-card" />
                <p className="rating-number-card">{rating}</p>
              </div>
            </div>
          </div>
          <div className="location-package-container-card">
            <div className="icon-type-container-card">
              <IoLocationSharp className="type-icon" />
              <p className="type-text">{location}</p>
            </div>
            <div className="icon-type-container-card">
              <BsFillBriefcaseFill className="type-icon" />
              <p className="type-text">{employmentType}</p>
            </div>
            <p className="package-text">{packagePerAnnum}</p>
          </div>

          <hr className="separator" />
          <div className="description-visit-link-container">
            <h1 className="description-heading-card">Description</h1>
            <a href={companyWebsiteUrl} className="company-link">
              Visit
              <FiExternalLink className="external-link-logo" />
            </a>
          </div>
          <p className="job-description-card">{jobDescription}</p>
          <h1 className="skills-heading">Skills</h1>
          <ul className="skills-list">
            {skills.map((eachSkill) => {
              const { imageUrl, name } = eachSkill;
              return (
                <li className="skill-item" key={name}>
                  <img src={imageUrl} alt={name} className="skill-image" />
                  <p className="skill-name">{name}</p>
                </li>
              );
            })}
          </ul>
          <h1 className="life-at-company-heading">Life at Company</h1>
          <div className="company-life-container">
            <p className="life-description">{lifeAtCompany.description}</p>
            <img
              className="life-image"
              src={lifeAtCompany.imageUrl}
              alt="life at company"
            />
          </div>
        </div>
        <h1 className="similar-jobs-heading">Similar Jobs</h1>
        <ul className="similar-jobs-list">
          {similarJobs.map((eachJob) => (
            <SimilarJobCard key={eachJob.id} jobDetails={eachJob} />
          ))}
        </ul>
      </div>
    );
  };

  const renderJobDetailsPage = () => {
    switch (jobDetailsApiStatus) {
      case apiStatusConstants.inProgress:
        return renderLoaderView();
      case apiStatusConstants.success:
        return renderJobDetails();
      case apiStatusConstants.failure:
        return renderApiFailureView();
      default:
        return null;
    }
  };

  return (
    <div className="job-details-page">
      <Header />
      {renderJobDetailsPage()}
    </div>
  );
};

JobItemDetails.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default JobItemDetails;
