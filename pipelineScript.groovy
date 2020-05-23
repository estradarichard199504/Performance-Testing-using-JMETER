node {
  stage 'Run JMeter Test'
  sh 'C:/apache-jmeter-5.2.1/bin/jmeter.sh -n -t C:/apache-jmeter-5.2.1/bin/examples/eCommerce-test-plan/eCommercePagesTestPlan.jmx -l C:/apache-jmeter-5.2.1/bin/examples/eCommerce-test-plan/ test.jtl'
}