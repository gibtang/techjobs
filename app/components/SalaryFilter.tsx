import { Head } from "blitz"
import { Button, Heading } from "react-bulma-components"
import { RiMailAddLine } from "react-icons/ri"

const SalaryFilter = () => {
  const handleChange = (e) => {
    console.log(`setting minimum salary to ${e.target.value}`);
   // console.log(e.target.value);
  }

  return (
      <span className="job-filter-label-text">With salary more than
      <select onBlur={handleChange} name="salary" id="salary">
        <option value="2000">2000</option>
        <option value="4000">4000</option>
        <option value="6000">6000</option>
        <option value="8000">8000</option>
      </select>
    </span>
  )
}

export default SalaryFilter
