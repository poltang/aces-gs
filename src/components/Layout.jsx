import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import NavLicense from 'components/NavLicense'

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
          <div className="bg-white">
            <div id="" className="bg-white max-w-5xl mx-auto py-3 px-4 sm:px-6">
              <div className="flex flex-row items-center">
                <div className="flex flex-grow items-center">
                  <div id="ac-logo" className="h-8 w-16 mr-4 bg-pink-200"></div>
                  <div className="flex-grow">
                    <span className="text-gray-800 font-semibold">{this.props.license.licenseName}</span>
                  </div>
                </div>
                <div className="flex flex-row flex-0 flex-end">
                  <Link href="/logout">
                    <a className="px-1 py-1 mr-3 text-sm text-gray-600 hover:text-gray-700">Support</a>
                  </Link>
                  <Link href="/logout">
                    <a className="px-1 py-1 mr-4 text-sm text-gray-600 hover:text-gray-700">Docs</a>
                  </Link>
                  <Link href="/logout">
                    <a className="rounded-md border px-3 py-1 text-sm text-gray-500 hover:text-gray-600 hover:border-gray-500">Logout</a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {/* kkkkkkk */}
          <NavLicense slug={this.props.license.slug} selected={this.props.nav} />
          <div className="">
            {this.props.children}
          </div>
        </main>
      </>
    )
  }
}