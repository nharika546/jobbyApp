import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import FiltersGroup from '../FiltersGroup'
import JobCard from '../JobCard'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employentTypeId: 'INTERNSHIP',
  },
]
const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA nad above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]
const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
class Jobs extends Component {
  state = {
    jobsList: [],
    apiStatus: apiStatusConstants.initial,
    employentType: [],
    minimumSalary: 0,
    searchInput: '',
  }
  componentDidMount() {
    this.getJobs()
  }
  getJobs = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {employentType, minimumSalary, searchInput} = this.state
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employentType.join()}&minimum_package=${minimumSalary}&search=${searchInput}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedJobsData = data.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        jobsList: updatedJobsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }
  renderJobsList = () => {
    const {jobsList} = this.state
    const renderJobsListlen = jobsList.length > 0
    return renderJobsListlen ? (
      <div>
        <ul>
          {jobsList.map(each => (
            <JobCard jobData={each} key={each.id} />
          ))}
        </ul>
      </div>
    ) : (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs.Try other filters.</p>
      </div>
    )
  }
  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seen to find the page you are looking for</p>
      <button type="button" data-testid="button" onClick={this.getJobs}>
        Retry
      </button>
    </div>
  )
  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" height="50" width="50" />
    </div>
  )
  renderAllJobs = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsList()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
  changeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }
  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobs()
    }
  }
  changeSalary = salary => {
    this.setState({minimumSalary: salary}, this.getJobs)
  }
  changeEmployeesList = type => {
    this.setState(
      prev => ({
        employentType: [...prev.employentType, type],
      }),
      this.getJobs,
    )
  }
  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />
        <div>
          <div>
            <h1>Type of Employment</h1>
            <h1>Salary Range</h1>
            <FiltersGroup
              employmentTypesList={employmentTypesList}
              salaryRangesList={salaryRangesList}
              changeSearchInput={this.changeSearchInput}
              searchInput={searchInput}
              getJobs={this.getJobs}
              changeSalary={this.changeSalary}
              changeEmployeesList={this.changeEmployeesList}
            />
            <div>
              <div>
                <input
                  type="search"
                  placeholder="Search"
                  onChange={this.changeSearchInput}
                  onKeyDown={this.onEnterSearchInput}
                />
                <button
                  type="button"
                  data-testid="searchButton"
                  onClick={this.getJobs}
                >
                  <BsSearch />
                </button>
              </div>
              {this.renderAllJobs()}
            </div>
          </div>
        </div>
      </>
    )
  }
}
export default Jobs
