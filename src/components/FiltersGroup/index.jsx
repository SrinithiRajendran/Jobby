import PropTypes from "prop-types";
import "./index.css";

const FiltersGroup = ({
  updateSalaryRangeId,
  activeSalaryRangeId,
  updateEmploymentTypesChecked,
  employmentTypesChecked,
}) => {
  const employmentTypes = [
    { label: "Full Time", id: "Full Time" },
    { label: "Part Time", id: "Part Time" },
    { label: "Freelance", id: "Freelance" },
    { label: "Internship", id: "Internship" },
  ];

  const salaryRanges = [
    { label: "None", id: "" },
    { label: "10 LPA and above", id: "10" },
    { label: "20 LPA and above", id: "20" },
    { label: "30 LPA and above", id: "30" },
    { label: "40 LPA and above", id: "40" },
  ];

  return (
    <div className="filters-group-container">
      <h1 className="filters-heading">Type of Employment</h1>
      <ul className="filters-list">
        {employmentTypes.map((type) => (
          <li key={type.id} className="filters-list-item">
            <input
              type="checkbox"
              id={type.id}
              className="checkbox-input"
              checked={employmentTypesChecked.includes(type.id)}
              onChange={() => updateEmploymentTypesChecked(type.id)}
            />
            <label htmlFor={type.id} className="filter-label">
              {type.label}
            </label>
          </li>
        ))}
      </ul>
      <h1 className="filters-heading">Salary Range</h1>
      <ul className="filters-list">
        {salaryRanges.map((range) => (
          <li key={range.id} className="filters-list-item">
            <input
              type="radio"
              id={range.id}
              name="salaryRange"
              className="checkbox-input"
              checked={activeSalaryRangeId === range.id}
              onChange={() => updateSalaryRangeId(range.id)}
            />
            <label htmlFor={range.id} className="filter-label">
              {range.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

FiltersGroup.propTypes = {
  updateSalaryRangeId: PropTypes.func.isRequired,
  activeSalaryRangeId: PropTypes.string.isRequired,
  updateEmploymentTypesChecked: PropTypes.func.isRequired,
  employmentTypesChecked: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default FiltersGroup;
