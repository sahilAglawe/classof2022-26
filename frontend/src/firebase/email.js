import emailjs from '@emailjs/browser'
import { getApprovedUsers } from './firestore'

// ==========================================
// EmailJS Configuration
// ==========================================
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
const TEMPLATE_PENDING = import.meta.env.VITE_EMAILJS_TEMPLATE_PENDING
const TEMPLATE_DECISION = import.meta.env.VITE_EMAILJS_TEMPLATE_DECISION

// Initialize EmailJS with Public Key
emailjs.init(PUBLIC_KEY)

// ==========================================
// MAIL 1: Registration Pending — sent on signup
// ==========================================
export async function sendRegistrationPendingEmail({ name, email }) {
  try {
    console.log('[EmailJS Debug] Preparing to send pending email...')
    console.log('[EmailJS Debug] Service ID:', SERVICE_ID)
    console.log('[EmailJS Debug] Template ID:', TEMPLATE_PENDING)
    
    const templateParams = {
      to_name: name,
      name: name, // support custom template variable {{name}}
      to_email: email,
      email: email, // support custom template variable {{email}}
      subject: '🎓 Registration Received — Class of 2022-26',
      message_html: buildPendingEmailHTML(name),
    }

    await emailjs.send(SERVICE_ID, TEMPLATE_PENDING, templateParams)
    console.log('✅ Pending approval email sent to:', email)
  } catch (error) {
    console.error('❌ Failed to send pending email:', error)
    // Don't throw — email failure shouldn't block registration
  }
}

// ==========================================
// MAIL 2: Approval / Rejection — sent by admin
// ==========================================
export async function sendDecisionEmail({ name, email, status }) {
  try {
    console.log(`[EmailJS Debug] Preparing to send ${status} email...`)
    console.log('[EmailJS Debug] Service ID:', SERVICE_ID)
    console.log('[EmailJS Debug] Template ID:', TEMPLATE_DECISION)
    
    const isApproved = status === 'approved'
    
    const templateParams = {
      to_name: name,
      name: name, // support custom template variable {{name}}
      to_email: email,
      email: email, // support custom template variable {{email}}
      subject: isApproved
        ? '✅ Access Approved — Welcome to Class of 2022-26!'
        : '❌ Access Request Update — Class of 2022-26',
      message_html: isApproved
        ? buildApprovedEmailHTML(name)
        : buildRejectedEmailHTML(name),
    }

    await emailjs.send(SERVICE_ID, TEMPLATE_DECISION, templateParams)
    console.log(`✅ ${status} email sent to:`, email)
  } catch (error) {
    console.error('❌ Failed to send decision email:', error)
    // Don't throw — email failure shouldn't block the admin action
  }
}

// ==========================================
// HTML Email Templates
// ==========================================

function buildPendingEmailHTML(name) {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0e0b; border-radius: 16px; overflow: hidden; border: 1px solid #2d2a24;">
      <!-- Header Banner -->
      <div style="background: linear-gradient(135deg, #1c1a17 0%, #2d2a24 100%); padding: 40px 30px; text-align: center;">
        <h1 style="color: #c4a44b; font-size: 28px; margin: 0 0 8px 0; font-weight: 400; font-style: italic;">
          Class of 2022-26
        </h1>
        <p style="color: #a8a29e; font-size: 13px; margin: 0; letter-spacing: 2px; text-transform: uppercase;">
          Digital Yearbook &amp; Archive
        </p>
      </div>

      <!-- Content -->
      <div style="padding: 35px 30px;">
        <h2 style="color: #e7e5e4; font-size: 22px; margin: 0 0 20px 0;">
          Hi ${name} 👋
        </h2>
        <p style="color: #a8a29e; font-size: 15px; line-height: 1.7; margin: 0 0 20px 0;">
          Your registration request has been <strong style="color: #facc15;">successfully received</strong>.
        </p>
        <p style="color: #a8a29e; font-size: 15px; line-height: 1.7; margin: 0 0 25px 0;">
          Your account is currently <strong style="color: #facc15;">pending admin approval</strong>. 
          An administrator will review your request shortly. You'll receive another email once a decision has been made.
        </p>

        <!-- Status Badge -->
        <div style="background: rgba(250, 204, 21, 0.08); border: 1px solid rgba(250, 204, 21, 0.25); border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 25px;">
          <p style="color: #facc15; font-size: 14px; margin: 0 0 5px 0; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">
            ⏳ Status
          </p>
          <p style="color: #fde68a; font-size: 20px; margin: 0; font-weight: 700;">
            Awaiting Approval
          </p>
        </div>

        <p style="color: #78716c; font-size: 13px; line-height: 1.6; margin: 0;">
          Please be patient — approvals are usually processed within 24 hours. If you have any questions, reach out to the admin team.
        </p>
      </div>

      <!-- Footer -->
      <div style="background: #1c1a17; padding: 20px 30px; text-align: center; border-top: 1px solid #2d2a24;">
        <p style="color: #57534e; font-size: 12px; margin: 0;">
          © 2026 Class of 2022-26 • CSE Department
        </p>
      </div>
    </div>
  `
}

function buildApprovedEmailHTML(name) {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0e0b; border-radius: 16px; overflow: hidden; border: 1px solid #2d2a24;">
      <!-- Header Banner -->
      <div style="background: linear-gradient(135deg, #1c1a17 0%, #2d2a24 100%); padding: 40px 30px; text-align: center;">
        <h1 style="color: #c4a44b; font-size: 28px; margin: 0 0 8px 0; font-weight: 400; font-style: italic;">
          Class of 2022-26
        </h1>
        <p style="color: #a8a29e; font-size: 13px; margin: 0; letter-spacing: 2px; text-transform: uppercase;">
          Digital Yearbook &amp; Archive
        </p>
      </div>

      <!-- Content -->
      <div style="padding: 35px 30px;">
        <h2 style="color: #e7e5e4; font-size: 22px; margin: 0 0 20px 0;">
          Congratulations, ${name}! 🎉
        </h2>
        <p style="color: #a8a29e; font-size: 15px; line-height: 1.7; margin: 0 0 20px 0;">
          Great news! Your access request has been <strong style="color: #4ade80;">approved</strong> by an administrator.
        </p>
        <p style="color: #a8a29e; font-size: 15px; line-height: 1.7; margin: 0 0 25px 0;">
          You can now sign in with your registered email and password to access the full Class of 2022-26 digital archive.
        </p>

        <!-- Status Badge -->
        <div style="background: rgba(74, 222, 128, 0.08); border: 1px solid rgba(74, 222, 128, 0.25); border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 25px;">
          <p style="color: #4ade80; font-size: 14px; margin: 0 0 5px 0; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">
            ✅ Status
          </p>
          <p style="color: #86efac; font-size: 20px; margin: 0; font-weight: 700;">
            Access Approved
          </p>
        </div>

        <!-- What you can do -->
        <div style="margin-bottom: 25px;">
          <p style="color: #d6d3d1; font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">
            What you can do now:
          </p>
          <ul style="color: #a8a29e; font-size: 14px; line-height: 2; margin: 0; padding-left: 20px;">
            <li>📸 Browse &amp; upload photos in the Media Vault</li>
            <li>📝 Write messages in the Yearbook</li>
            <li>💬 Post on The Wall</li>
            <li>🎓 Explore the complete digital archive</li>
          </ul>
        </div>

        <p style="color: #78716c; font-size: 13px; line-height: 1.6; margin: 0;">
          Head over to the website and sign in to get started. Welcome aboard! 🚀
        </p>
      </div>

      <!-- Footer -->
      <div style="background: #1c1a17; padding: 20px 30px; text-align: center; border-top: 1px solid #2d2a24;">
        <p style="color: #57534e; font-size: 12px; margin: 0;">
          © 2026 Class of 2022-26 • CSE Department
        </p>
      </div>
    </div>
  `
}

function buildRejectedEmailHTML(name) {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0e0b; border-radius: 16px; overflow: hidden; border: 1px solid #2d2a24;">
      <!-- Header Banner -->
      <div style="background: linear-gradient(135deg, #1c1a17 0%, #2d2a24 100%); padding: 40px 30px; text-align: center;">
        <h1 style="color: #c4a44b; font-size: 28px; margin: 0 0 8px 0; font-weight: 400; font-style: italic;">
          Class of 2022-26
        </h1>
        <p style="color: #a8a29e; font-size: 13px; margin: 0; letter-spacing: 2px; text-transform: uppercase;">
          Digital Yearbook &amp; Archive
        </p>
      </div>

      <!-- Content -->
      <div style="padding: 35px 30px;">
        <h2 style="color: #e7e5e4; font-size: 22px; margin: 0 0 20px 0;">
          Hi ${name},
        </h2>
        <p style="color: #a8a29e; font-size: 15px; line-height: 1.7; margin: 0 0 20px 0;">
          We regret to inform you that your access request has been <strong style="color: #f87171;">not approved</strong> at this time.
        </p>
        <p style="color: #a8a29e; font-size: 15px; line-height: 1.7; margin: 0 0 25px 0;">
          This could be due to incomplete information or verification issues. If you believe this was a mistake, please contact the admin team for further assistance.
        </p>

        <!-- Status Badge -->
        <div style="background: rgba(248, 113, 113, 0.08); border: 1px solid rgba(248, 113, 113, 0.25); border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 25px;">
          <p style="color: #f87171; font-size: 14px; margin: 0 0 5px 0; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">
            ❌ Status
          </p>
          <p style="color: #fca5a5; font-size: 20px; margin: 0; font-weight: 700;">
            Access Denied
          </p>
        </div>

        <p style="color: #78716c; font-size: 13px; line-height: 1.6; margin: 0;">
          If you have questions or need help, please reach out to the admin team directly.
        </p>
      </div>

      </div>
    </div>
  `
}

// ==========================================
// MAIL 3: Media Uploaded Notification — sent on upload
// ==========================================
export async function sendMediaUploadedNotifications({ uploaderName, caption, imageUrl, uploaderUid }) {
  try {
    console.log('[EmailJS Debug] Preparing to send media upload notifications...')
    
    // 1. Get all approved users
    const users = await getApprovedUsers()
    
    // 2. Filter out the uploader so they don't get a notification for their own upload
    const recipients = users.filter((user) => user.uid !== uploaderUid && user.email)
    
    if (recipients.length === 0) {
      console.log('[EmailJS Debug] No other approved users to notify.')
      return
    }

    console.log(`[EmailJS Debug] Sending notifications to ${recipients.length} user(s)...`)

    // 3. Send emails in the background (using Promise.allSettled to track status)
    const emailPromises = recipients.map(async (recipient) => {
      try {
        const templateParams = {
          to_name: recipient.name,
          name: recipient.name,
          to_email: recipient.email,
          email: recipient.email,
          subject: `📸 New Media Uploaded by ${uploaderName} — Class of 2022-26`,
          message_html: buildMediaUploadedEmailHTML(uploaderName, caption, imageUrl),
        }
        await emailjs.send(SERVICE_ID, TEMPLATE_DECISION, templateParams)
        console.log(`✅ Media upload notification sent to: ${recipient.email}`)
      } catch (err) {
        console.error(`❌ Failed to send media upload notification to ${recipient.email}:`, err)
      }
    })

    // Run all email requests concurrently in the background
    Promise.allSettled(emailPromises).then((results) => {
      const successes = results.filter((r) => r.status === 'fulfilled').length
      console.log(`[EmailJS Debug] Finished sending notifications: ${successes}/${recipients.length} succeeded.`)
    })

  } catch (error) {
    console.error('❌ Failed to send media upload notifications:', error)
  }
}

function buildMediaUploadedEmailHTML(uploaderName, caption, imageUrl) {
  const siteUrl = window.location.origin
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0e0b; border-radius: 16px; overflow: hidden; border: 1px solid #2d2a24;">
      <!-- Header Banner -->
      <div style="background: linear-gradient(135deg, #1c1a17 0%, #2d2a24 100%); padding: 40px 30px; text-align: center;">
        <h1 style="color: #c4a44b; font-size: 28px; margin: 0 0 8px 0; font-weight: 400; font-style: italic;">
          Class of 2022-26
        </h1>
        <p style="color: #a8a29e; font-size: 13px; margin: 0; letter-spacing: 2px; text-transform: uppercase;">
          Digital Yearbook &amp; Archive
        </p>
      </div>

      <!-- Content -->
      <div style="padding: 35px 30px;">
        <h2 style="color: #e7e5e4; font-size: 22px; margin: 0 0 20px 0; font-weight: 500;">
          New Memory Uploaded! 📸
        </h2>
        <p style="color: #a8a29e; font-size: 15px; line-height: 1.7; margin: 0 0 20px 0;">
          <strong style="color: #facc15;">${uploaderName}</strong> has just uploaded a new memory to the Media Vault. Check it out to relive the moment!
        </p>

        <!-- Media Card -->
        <div style="background: #161412; border: 1px solid #2d2a24; border-radius: 12px; overflow: hidden; margin-bottom: 25px;">
          ${imageUrl ? `
            <div style="width: 100%; text-align: center; background: #000; padding: 15px 0;">
              <img src="${imageUrl}" alt="Uploaded Memory" style="max-width: 100%; max-height: 300px; object-fit: contain; display: block; margin: 0 auto; border-radius: 6px;" />
            </div>
          ` : ''}
          <div style="padding: 20px; border-top: 1px solid #2d2a24;">
            <p style="color: #e7e5e4; font-size: 16px; font-style: italic; margin: 0 0 8px 0; font-family: 'Georgia', serif; line-height: 1.5;">
              "${caption}"
            </p>
            <p style="color: #78716c; font-size: 12px; margin: 0; text-transform: uppercase; letter-spacing: 1px;">
              Uploaded by ${uploaderName}
            </p>
          </div>
        </div>

        <!-- Button -->
        <div style="text-align: center; margin: 30px 0 20px 0;">
          <a href="${siteUrl}" target="_blank" style="background: #c4a44b; color: #0f0e0b; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px; display: inline-block; box-shadow: 0 4px 12px rgba(196,164,75,0.2);">
            Open Media Vault
          </a>
        </div>

        <p style="color: #78716c; font-size: 13px; line-height: 1.6; margin: 0; text-align: center;">
          You are receiving this because you are a verified member of the Class of 2022-26.
        </p>
      </div>

      <!-- Footer -->
      <div style="background: #1c1a17; padding: 20px 30px; text-align: center; border-top: 1px solid #2d2a24;">
        <p style="color: #57534e; font-size: 12px; margin: 0;">
          © 2026 Class of 2022-26 • CSE Department
        </p>
      </div>
    </div>
  `
}
