import React from 'react'
import Head from 'next/head'
import NavLicense from 'components/NavLicense'
import NavUser from './NavUser'

export default class FormLayout extends React.Component {

  // handleScroll = function(e) {
  //   if (window.pageYOffset > 55) {
  //     document.getElementById('aces-main').classList.add('scrolled');
  //   } else {
  //     document.getElementById('aces-main').classList.remove('scrolled');
  //   }
  // }

  // componentDidMount () {
  //   window.document.body.classList.remove("bg-purple-500")
  //   window.addEventListener('scroll', this.handleScroll, false);
  // }

  // componentWillUnmount() {
  //   window.removeEventListener('scroll', this.handleScroll, false);
  // }

  render() {
    return (
      <>
        <Head>
          <title>ACES - New Client</title>
        </Head>
        <main id="aces-main">
          {/* <NavUser user={this.props.user} licenseName={this.props.license.licenseName} /> */}
          {/* <NavLicense slug={this.props.license.slug} selected={this.props.nav} /> */}
          <div className="z-50 fixed w-full bg-white border-b border-gray-400">
            <div id="" className="max-w-5xl mx-auto py-3 px-4 sm:px-6">
              <div className="flex flex-row items-center justify-center">
                <div id="ac-logo" className="h-8 w-16 mr-4 bg-pink-200"></div>
                <div className="flex-grows">
                  <span className="text-gray-800 font-semibold">ACES Form</span>
                </div>
              </div>
            </div>
          </div>
          {/*  */}
          <div className="">
            {this.props.children}
          </div>
        </main>
      </>
    )
  }
}