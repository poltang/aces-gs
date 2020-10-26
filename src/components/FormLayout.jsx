import React from 'react'
import Head from 'next/head'
import NavLicense from 'components/NavLicense'
import NavUser from './NavUser'

export default class FormLayout extends React.Component {

  render() {
    return (
      <>
        <Head>
          <title>ACES - New Client</title>
        </Head>
        <main id="aces-main" className="min-h-screen">
          <div className="min--screen bgs-gray-100 bg-gradient-to-b from-gray-300 px-4 sm:px-6 pb-24">
            <div className="max-w-xl mx-auto antialiased">
              <div className="text-xs text-center font-bold pt-8 pb-2">
                <span className="rounded-sm bg-blue-800 bg-opacity-25 text-white border-l border-b border-gray-100 px-2 py-1">ACES Form</span>
              </div>
              <h1 className="text-xl text-center text-blue-900 font-semibold opacity-50 mb-8">
                {this.props.license.licenseName}
              </h1>
            </div>
            <div className="max-w-xl mx-auto">
              {this.props.children}
            </div>
          </div>
        </main>
        <footer id="aces-footer" className="h-64 text-xs text-gray-500 border-t border-gray-300">
          <p className="text-center my-6">GAIA ACES</p>
        </footer>
      </>
    )
  }
}