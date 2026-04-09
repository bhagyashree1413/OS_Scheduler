import React from 'react'
import FooterColumn from './FooterColumn'
import { GitHubIcon, LinkedInIcon } from './Icons'

const Footer = () => {
	return (
		<footer className="site-footer">
			<div className="footer-glass">
				<div className="footer-inner">
					<div className="footer-grid">
						<div className="footer-brand">
							<a href="/" className="footer-logo">Schedulify</a>
							<p className="footer-tag">Visualizing CPU Scheduling Made Simple</p>
							<p className="footer-desc">Interactive simulations and concise explanations for students and developers.</p>

							<div className="footer-built">Built with <span>React</span>, <span>Node.js</span>, <span>Express</span></div>
						</div>

						<FooterColumn
							title="Algorithms"
							links={[
								{ label: 'FCFS', href: '/algorithms/fcfs' },
								{ label: 'SJF', href: '/algorithms/sjf' },
								{ label: 'Round Robin', href: '/algorithms/rr' },
							]}
						/>

						<FooterColumn
							title="Resources"
							links={[
								{ label: 'Documentation', href: '/docs' },
								{ label: 'Learn Scheduling', href: '/learn' },
								{ label: 'GitHub Repository', href: 'https://github.com/your-repo' },
								{ label: 'Contact', href: '/contact' },
							]}
						/>

						<div>
							<h4 className="footer-col-title">Account</h4>
							<ul className="footer-list">
								<li><a href="/login">Login</a></li>
								<li><a href="/register">Register</a></li>
								<li><a href="/dashboard">Dashboard</a></li>
							</ul>

							<div className="footer-socials">
								<a href="https://github.com/your-repo" aria-label="GitHub"><GitHubIcon className="icon" /></a>
								<a href="https://linkedin.com/in/your-profile" aria-label="LinkedIn"><LinkedInIcon className="icon" /></a>
							</div>
						</div>
					</div>

					<div className="footer-bottom">
						<p className="muted">© 2026 Schedulify — All rights reserved</p>
						<p className="muted">Made for learning OS scheduling • Minimal, developer-focused UI</p>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer
