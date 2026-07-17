const express = require('express');
const router = express.Router();

router.post('/recover', (req, res) => {
  const { owner, repository } = req.body;

  if (!owner || !repository) {
    return res.status(400).json({
      success: false,
      message: 'Invalid input parameters. Please supply owner and repository.'
    });
  }

  const cleanOwner = owner.trim().toLowerCase();
  const cleanRepo = repository.trim().toLowerCase();

  if (cleanOwner === 'codechefvit' && cleanRepo === 'blackbox') {
    console.log(`[MODULE 2 SUCCESS] Repository successfully recovered! Owner: ${cleanOwner}, Repo: ${cleanRepo}`);
    return res.json({
      success: true,
      url: 'https://github.com/codechefvit/blackbox',
      message: 'Repository Located. Connecting...'
    });
  } else {
    console.log(`[MODULE 2 FAILURE] Recovery attempt failed. Input Owner: ${cleanOwner}, Repo: ${cleanRepo}`);
    return res.status(404).json({
      success: false,
      message: 'Repository Not Found. Try Again.'
    });
  }
});

router.post('/verifyRecoveryKey', (req, res) => {
  const { recoveryKey } = req.body;

  if (!recoveryKey) {
    return res.status(400).json({
      success: false,
      message: 'Recovery Key is required.'
    });
  }

  const cleanKey = recoveryKey.trim().toUpperCase();

  if (cleanKey === 'BBX-RECOVERY-9X41A') {
    console.log(`[MODULE 2 KEY SUCCESS] Recovery Key accepted: ${cleanKey}`);
    return res.json({
      success: true,
      nextModule: '/module3'
    });
  } else {
    console.log(`[MODULE 2 KEY FAILURE] Invalid key submitted: ${cleanKey}`);
    return res.status(400).json({
      success: false,
      message: 'Invalid Recovery Key'
    });
  }
});

module.exports = router;
