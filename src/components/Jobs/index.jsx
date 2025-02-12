import { useState, useEffect, useCallback } from "react";
import { BsSearch } from "react-icons/bs";
import { ThreeDots } from "react-loader-spinner";

import Header from "../Header";
import ProfileDetails from "../ProfileDetails";
import FiltersGroup from "../FiltersGroup";
import JobCard from "../JobCard";

import "./index.css";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const Jobs = () => {
  const [profileDetails, setProfileDetails] = useState({});
  const [profileApiStatus, setProfileApiStatus] = useState(
    apiStatusConstants.initial
  );
  const [jobsList, setJobsList] = useState([]);
  const [jobsApiStatus, setJobsApiStatus] = useState(
    apiStatusConstants.initial
  );
  const [searchInput, setSearchInput] = useState("");
  const [activeSalaryRangeId, setActiveSalaryRangeId] = useState("");
  const [employmentTypesChecked, setEmploymentTypesChecked] = useState([]);

  const getJobs = useCallback(async () => {
    setJobsApiStatus(apiStatusConstants.inProgress);

    try {
      const response = await fetch("http://localhost:3001/jobs");
      const data = await response.json();

      const filteredJobs = data.filter((job) => {
        const matchesEmploymentType =
          employmentTypesChecked.length === 0 ||
          employmentTypesChecked.includes(job.employmentType);
        const matchesSalaryRange =
          !activeSalaryRangeId ||
          parseInt(job.packagePerAnnum) >= parseInt(activeSalaryRangeId);
        const matchesSearchInput = job.title
          .toLowerCase()
          .includes(searchInput.toLowerCase());
        return (
          matchesEmploymentType && matchesSalaryRange && matchesSearchInput
        );
      });

      setJobsList(filteredJobs);
      setJobsApiStatus(apiStatusConstants.success);
    } catch {
      setJobsApiStatus(apiStatusConstants.failure);
    }
  }, [activeSalaryRangeId, employmentTypesChecked, searchInput]);

  const getProfileDetails = useCallback(async () => {
    setProfileApiStatus(apiStatusConstants.inProgress);

    try {
      const response = await fetch("http://localhost:3001/profile");
      const data = await response.json();
      setProfileDetails(data);
      setProfileApiStatus(apiStatusConstants.success);
    } catch {
      setProfileApiStatus(apiStatusConstants.failure);
    }
  }, []);

  useEffect(() => {
    getProfileDetails();
    getJobs();
  }, [getJobs, getProfileDetails]);

  const updateEmploymentTypesChecked = (typeId) => {
    let updatedList = employmentTypesChecked;
    if (employmentTypesChecked.includes(typeId)) {
      updatedList = employmentTypesChecked.filter(
        (eachType) => eachType !== typeId
      );
    } else {
      updatedList = [...updatedList, typeId];
    }

    setEmploymentTypesChecked(updatedList);
    getJobs();
  };

  const updateSalaryRangeId = (activeSalaryRangeId) => {
    setActiveSalaryRangeId(activeSalaryRangeId);
    getJobs();
  };

  const renderSearchBar = (searchBarID) => (
    <div className="search-bar" id={searchBarID}>
      <input
        className="search-input"
        type="search"
        placeholder="Search"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <button
        className="search-button"
        type="button"
        data-testid="searchButton"
        onClick={getJobs}
      >
        <BsSearch className="search-icon" />
      </button>
    </div>
  );

  const renderSideBar = () => (
    <div className="side-bar">
      {renderSearchBar("smallSearchBar")}
      <ProfileDetails
        profileDetails={profileDetails}
        profileApiStatus={profileApiStatus}
        getProfileDetails={getProfileDetails}
      />
      <hr className="separator" />
      <FiltersGroup
        updateSalaryRangeId={updateSalaryRangeId}
        activeSalaryRangeId={activeSalaryRangeId}
        updateEmploymentTypesChecked={updateEmploymentTypesChecked}
        employmentTypesChecked={employmentTypesChecked}
      />
    </div>
  );

  const renderNoJobsView = () => (
    <div className="no-jobs-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="no-jobs-image"
      />
      <h1 className="no-jobs-heading">No Jobs Found</h1>
      <p className="no-jobs-description">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  );

  const renderJobsList = () => (
    <>
      {jobsList.length > 0 ? (
        <ul className="jobs-list">
          {jobsList.map((eachJob) => (
            <JobCard key={eachJob.id} jobDetails={eachJob} />
          ))}
        </ul>
      ) : (
        renderNoJobsView()
      )}
    </>
  );

  const renderJobsLoaderView = () => (
    <div className="jobs-loader-container" data-testid="loader">
      <ThreeDots color="#ffffff" height={50} width={50} />
    </div>
  );

  const renderJobsApiFailureView = () => (
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
      <button type="button" className="retry-button" onClick={getJobs}>
        Retry
      </button>
    </div>
  );

  const renderJobsBasedOnApiStatus = () => {
    switch (jobsApiStatus) {
      case apiStatusConstants.inProgress:
        return renderJobsLoaderView();
      case apiStatusConstants.success:
        return renderJobsList();
      case apiStatusConstants.failure:
        return renderJobsApiFailureView();
      default:
        return null;
    }
  };

  return (
    <div className="jobs-page-container">
      <Header />
      <div className="jobs-page">
        {renderSideBar()}
        <div className="jobs-container">
          {renderSearchBar("largeSearchBar")}
          {renderJobsBasedOnApiStatus()}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
