import React from 'react'
import Head from 'next/head'
import NavLicense from 'components/NavLicense'
import NavUser from './NavUser'

export default class Layout extends React.Component {

  handleScroll = function(e) {
    if (window.pageYOffset > 55) {
      document.getElementById('aces-main').classList.add('scrolled');
    } else {
      document.getElementById('aces-main').classList.remove('scrolled');
    }
  }

  componentDidMount () {
    window.document.body.classList.remove("bg-purple-500")
    window.addEventListener('scroll', this.handleScroll, false);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll, false);
  }

  render() {
    return (
      <>
        <Head>
          <title>{this.props.license.licenseName}</title>
        </Head>
        <main id="aces-main">
          <NavUser user={this.props.user} licenseName={this.props.license.licenseName} />
          <NavLicense slug={this.props.license.slug} selected={this.props.nav} />
          <div className="">
            {this.props.children}
          </div>
        </main>
      </>
    )
  }
}