import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {AiOutlineSearch} from 'react-icons/ai'

import Header from '../Header'
import JobItem from '../JobItem'
import './index.css'

const employentTypesList = [
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
const apiJobsStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
const failureViewImg =
  'https://assets.ccbp.in/frontend/react-js/failure-img.png'
class AllJobs extends Component {
  state = {
    profileData: [],
    jobsData: [],
    checkboxInputs: [],
    radioInput: '',
    searchInput: '',
    apiStatus: apiStatusContants.initial,
    apiJobsStatus: apiJobsStatusConstants.initial,
  }
  componentDidMount = () => {
    this.onGetProfileDetails()
    this.onGetJobDetails()
  }
  onGetProfileDetails = async () => {
    this.setState({apiStatus: apiStatusContants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {checkboxInputs, radioInput, searchInput} = this.state
    const profileApiUrl = 'https://apis.ccbp.in/profile'
    const optionsProfile = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const responseProfile = await fetch(profileApiUrl, optionsProfile)
    if (responseProfile.ok === true) {
      const fetchedDataProfile = [await responseProfile.json()]
      const updatedDataProfile = fetchedDataProfile.map(each => ({
        name: each.profile_details.name,
        profileImageUrl: each.profile_details.profile_image_url,
        shortBio: each.profile_details.short_bio,
      }))
      this.setState({
        profileData: updatedDataProfile,
        responseSuccess: true,
        apiStatus: apiStatusContants.success,
      })
    } else {
      this.setState({apiStatus: apiJobsStatusContants.failure})
    }
  }
  onGetJobDetails = async () => {
    this.setState({apiJobsStatus: apiJobsStatusContants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {checkboxInputs, radioInput, searchInput} = this.state
    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${checkboxInputs}&minimum_package=${radioInput}&search=${searchInput}`
    const optionJobs = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      methos: 'GET',
    }
    const responseJobs = await fetch(jobsApiUrl, optionJobs)
    if (responseJobs.ok === true) {
      const fetchedDataJobs = await responseJobs.json()
      const updatedDataJobs = fetchedDataJobs.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employentType = each.employent_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        jobsData: updatedDataJobs,
        apiJobsStatus: apiJobsStatusContants.success,
      })
    } else {
      this.setState({apiJobsStatus: apiJobsStatusConstants.failure})
    }
  }
  onGetRadioOption = event => {
    this.setState({radioInput: event.target.id}, this.onGetJobDetails)
  }
  onGetInputOption = event => {
    const {checkboxInputs} = this.state
    const inputNotInList = checkboxInputs.filter(
      each => each === event.target.id,
    )
    if (inputNotInList.length === 0) {
      this.setState(
        prevState => ({
          checkboxInputs: [...prevState.checkboxInputs, event.target.id],
        }),
        this.onGetJobDetails,
      )
    } else {
      const filteredData = checkboxInputs.filter(
        each => each !== event.target.id,
      )
      this.setState(
        prevState => ({checkboxInputs: filteredData}),
        this.onGetJobDetails,
      )
    }
  }
  onGetProfileView = () => {
    const {profileData, responseSuccess} = this.state
    if (responseSuccess) {
      const {name, profileImageUrl, shortBio} = profileData[0]
      return (
        <div>
          <img src={profileImageUrl} alt="profile" />
          <h1>{name}</h1>
          <p>{shortBio}</p>
        </div>
      )
    }
    return null
  }
  onRetryProfile = () => {
    this.onGetProfileDetails()
  }
  onGetProfileFailureView = () => (
    <div>
      <button type="button" onClick={this.onRetryProfile}>
        retry
      </button>
    </div>
  )
  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" height="50" width="50" />
    </div>
  )
  onRenderProfileStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiJobsStatusConstants.success:
        return this.onGetProfileView()
      case apiStatusConstants.failure:
        return this.onGetProfileFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
  onRetryJobs = () => {
    this.onGetJobDetails()
  }
  onGetJobsFailureView = () => (
    <div>
      <img src={failureViewImg} alt="failure view" />
      <h1>Oops! Something Went Wrong</h1>
      <p>we cannot seem to find the page you are looking for</p>
      <div>
        <button type="button" onClick={this.onRetryJobs}>
          retry
        </button>
      </div>
    </div>
  )
  onGetJobsView = () => {
    const {jobsData} = this.state
    const noJobs = jobsData.length === 0
    return noJobs ? (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No jobs found</h1>
        <p>We could not find any jobs. Try other filters.</p>
      </div>
    ) : (
      <ul>
        {jobsData.map(each => (
          <JobItem key={each.id} jobsData={each} />
        ))}
      </ul>
    )
  }
  onRenderJobsStatus = () => {
    const {apiJobsStatus} = this.state
    switch (apiJobsStatus) {
      case apiJobsStatusConstants.success:
        return this.onGetJobsView()
      case apiJobsStatusConstants.failure:
        return this.onGetJobsFailureView()
      case apiJobsStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
  onGetCheckBoxesView = () => (
    <ul>
      {employentTypesList.map(each => (
        <li key={each.employentTypeId}>
          <input
            id={each.employentTypeId}
            type="checkbox"
            onChange={this.onGetInputOption}
          />
          <label htmlFor={each.employentTypeId}>{each.label}</label>
        </li>
      ))}
    </ul>
  )
  onGetRadioButtonsView = () => (
    <ul>
      {salaryRangesList.map(each => (
        <li key={each.salaryRangeId}>
          <input
            id={each.salaryRangeId}
            type="radio"
            name="option"
            onChange={this.onGetRadioOption}
          />
          <label htmlFor={each.salaryRangeId}>{each.label}</label>
        </li>
      ))}
    </ul>
  )
  onGetSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }
  onSubmitSearchInput = () => {
    onGetJobDetails()
  }
  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.onGetJobDetails()
    }
  }
  render() {
    const {checkboxInputs, radioInput, searchInput} = this.state
    return (
      <>
        <Header />
        <div>
          <div>
            {this.onRenderProfileStatus()}
            <hr />
            <h1>Type of Employment</h1>
            {this.onGetCheckBoxesView()}
            <hr />
            <h1>Salary Range</h1>
            {this.onGetRadioButtonsView()}
          </div>
          <div>
            <div>
              <input
                type="search"
                value={searchInput}
                placeholder="Search"
                onChange={this.onGetSearchInput}
                onKeyDown={this.onEnterSearchInput}
              />
              <button
                data-testid="searchButton"
                type="button"
                onClick={this.onSubmitSearchInput}
              >
                <AiOutlineSearch />
              </button>
            </div>
            {this.onRenderJobsStatus()}
          </div>
        </div>
      </>
    )
  }
}
export default AllJobs
